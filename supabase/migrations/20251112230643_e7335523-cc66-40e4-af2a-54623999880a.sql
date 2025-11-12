-- Phase 1: Create AI Provider Health Tracking Table
CREATE TABLE IF NOT EXISTS public.ai_provider_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'unhealthy', 'degraded')),
  last_success_at timestamp with time zone,
  last_failure_at timestamp with time zone,
  last_error_message text,
  consecutive_failures integer DEFAULT 0,
  cooldown_until timestamp with time zone,
  total_requests bigint DEFAULT 0,
  total_successes bigint DEFAULT 0,
  total_failures bigint DEFAULT 0,
  average_latency_ms numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_provider_health ENABLE ROW LEVEL SECURITY;

-- Admins can manage provider health
CREATE POLICY "Admins can manage provider health"
  ON public.ai_provider_health
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view provider health (for debugging)
CREATE POLICY "Anyone can view provider health"
  ON public.ai_provider_health
  FOR SELECT
  USING (true);

-- Insert initial provider records
INSERT INTO public.ai_provider_health (provider_name, status) 
VALUES 
  ('google', 'healthy'),
  ('openai', 'healthy'),
  ('anthropic', 'healthy')
ON CONFLICT (provider_name) DO NOTHING;

-- Phase 2: Create Document Processing Queue Table
CREATE TABLE IF NOT EXISTS public.document_processing_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  family_id uuid NOT NULL,
  job_type text NOT NULL CHECK (job_type IN ('EXTRACT', 'ANALYZE')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 5,
  priority integer DEFAULT 0,
  last_error jsonb,
  process_after timestamp with time zone DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  processing_time_ms integer,
  ai_provider_used text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_processing_queue ENABLE ROW LEVEL SECURITY;

-- Family members can view their queue items
CREATE POLICY "Family members can view queue items"
  ON public.document_processing_queue
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

-- System can insert queue items
CREATE POLICY "System can insert queue items"
  ON public.document_processing_queue
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

-- System can update queue items
CREATE POLICY "System can update queue items"
  ON public.document_processing_queue
  FOR UPDATE
  USING (true);

-- Admins can delete queue items
CREATE POLICY "Admins can delete queue items"
  ON public.document_processing_queue
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role) OR is_family_owner(auth.uid(), family_id));

-- Create indexes for performance
CREATE INDEX idx_queue_status_process_after ON public.document_processing_queue(status, process_after) 
  WHERE status IN ('queued', 'processing');
CREATE INDEX idx_queue_document_id ON public.document_processing_queue(document_id);
CREATE INDEX idx_queue_family_id ON public.document_processing_queue(family_id);
CREATE INDEX idx_queue_job_type ON public.document_processing_queue(job_type);

-- Phase 3: Create function to get next queue job
CREATE OR REPLACE FUNCTION public.get_next_queue_job()
RETURNS TABLE (
  id uuid,
  document_id uuid,
  family_id uuid,
  job_type text,
  retry_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    q.id,
    q.document_id,
    q.family_id,
    q.job_type,
    q.retry_count
  FROM public.document_processing_queue q
  WHERE 
    q.status = 'queued'
    AND q.process_after <= now()
    AND q.retry_count < q.max_retries
  ORDER BY 
    q.priority DESC,
    q.created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 4: Create function to update provider health
CREATE OR REPLACE FUNCTION public.update_provider_health(
  p_provider_name text,
  p_success boolean,
  p_latency_ms integer DEFAULT NULL,
  p_error_message text DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_consecutive_failures integer;
  v_new_status text;
  v_cooldown_until timestamp with time zone;
BEGIN
  -- Get current consecutive failures
  SELECT consecutive_failures INTO v_consecutive_failures
  FROM public.ai_provider_health
  WHERE provider_name = p_provider_name;

  IF p_success THEN
    -- Success: reset failures and update success metrics
    v_new_status := 'healthy';
    v_consecutive_failures := 0;
    v_cooldown_until := NULL;
    
    UPDATE public.ai_provider_health
    SET 
      status = v_new_status,
      last_success_at = now(),
      consecutive_failures = 0,
      cooldown_until = NULL,
      total_requests = total_requests + 1,
      total_successes = total_successes + 1,
      average_latency_ms = COALESCE(
        (average_latency_ms * total_successes + p_latency_ms) / (total_successes + 1),
        p_latency_ms
      ),
      updated_at = now()
    WHERE provider_name = p_provider_name;
  ELSE
    -- Failure: increment failures and potentially mark unhealthy
    v_consecutive_failures := COALESCE(v_consecutive_failures, 0) + 1;
    
    -- Mark unhealthy after 3 consecutive failures
    IF v_consecutive_failures >= 3 THEN
      v_new_status := 'unhealthy';
      -- 15 minute cooldown
      v_cooldown_until := now() + interval '15 minutes';
    ELSIF v_consecutive_failures >= 1 THEN
      v_new_status := 'degraded';
      v_cooldown_until := NULL;
    ELSE
      v_new_status := 'healthy';
      v_cooldown_until := NULL;
    END IF;
    
    UPDATE public.ai_provider_health
    SET 
      status = v_new_status,
      last_failure_at = now(),
      last_error_message = p_error_message,
      consecutive_failures = v_consecutive_failures,
      cooldown_until = v_cooldown_until,
      total_requests = total_requests + 1,
      total_failures = total_failures + 1,
      updated_at = now()
    WHERE provider_name = p_provider_name;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 5: Create trigger to update queue updated_at
CREATE OR REPLACE FUNCTION public.update_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_queue_timestamp
  BEFORE UPDATE ON public.document_processing_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_queue_updated_at();
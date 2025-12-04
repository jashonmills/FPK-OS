-- =====================================================
-- ANALYSIS QUEUE SYSTEM FOR PARALLEL PROCESSING
-- =====================================================

-- Create analysis_queue table to manage document processing
CREATE TABLE IF NOT EXISTS public.analysis_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.analysis_jobs(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INTEGER NOT NULL DEFAULT 5,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.analysis_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Family members can view their queue items"
  ON public.analysis_queue
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can insert queue items"
  ON public.analysis_queue
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can update queue items"
  ON public.analysis_queue
  FOR UPDATE
  USING (is_family_member(auth.uid(), family_id));

-- Indexes for performance
CREATE INDEX idx_analysis_queue_family_status ON public.analysis_queue(family_id, status);
CREATE INDEX idx_analysis_queue_priority ON public.analysis_queue(priority DESC, created_at ASC) WHERE status = 'pending';
CREATE INDEX idx_analysis_queue_document ON public.analysis_queue(document_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_analysis_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analysis_queue_updated_at
  BEFORE UPDATE ON public.analysis_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_analysis_queue_updated_at();

-- =====================================================
-- AUTO-QUEUE NEW DOCUMENT UPLOADS
-- =====================================================

CREATE OR REPLACE FUNCTION auto_queue_new_document()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only queue if document has content and is ready for analysis
  IF NEW.extracted_content IS NOT NULL AND LENGTH(NEW.extracted_content) > 100 THEN
    INSERT INTO public.analysis_queue (family_id, document_id, priority)
    VALUES (NEW.family_id, NEW.id, 10); -- New uploads get high priority
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_queue_document_on_upload
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION auto_queue_new_document();

-- =====================================================
-- HELPER FUNCTION: Get Next Queue Item
-- =====================================================

CREATE OR REPLACE FUNCTION get_next_queue_items(
  p_family_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS SETOF public.analysis_queue
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Lock and return next pending items by priority
  RETURN QUERY
  UPDATE public.analysis_queue
  SET status = 'processing',
      started_at = NOW()
  WHERE id IN (
    SELECT id
    FROM public.analysis_queue
    WHERE family_id = p_family_id
      AND status = 'pending'
      AND retry_count < max_retries
    ORDER BY priority DESC, created_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;

-- =====================================================
-- HELPER FUNCTION: Get Queue Statistics
-- =====================================================

CREATE OR REPLACE FUNCTION get_queue_stats(p_family_id UUID)
RETURNS TABLE(
  total_items BIGINT,
  pending_items BIGINT,
  processing_items BIGINT,
  completed_items BIGINT,
  failed_items BIGINT,
  avg_processing_time_sec NUMERIC
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT
    COUNT(*) as total_items,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_items,
    COUNT(*) FILTER (WHERE status = 'processing') as processing_items,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_items,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_items,
    ROUND(AVG(processing_time_ms) / 1000.0, 1) as avg_processing_time_sec
  FROM public.analysis_queue
  WHERE family_id = p_family_id;
$$;
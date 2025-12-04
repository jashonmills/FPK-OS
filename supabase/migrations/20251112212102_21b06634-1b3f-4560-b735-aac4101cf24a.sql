-- Create extraction queue for background processing
CREATE TABLE IF NOT EXISTS public.extraction_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  family_id UUID NOT NULL,
  priority INTEGER DEFAULT 5,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  chunk_index INTEGER DEFAULT NULL,
  total_chunks INTEGER DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  model_attempted TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for efficient queue processing
CREATE INDEX idx_extraction_queue_status_priority ON public.extraction_queue(status, priority DESC, created_at ASC);
CREATE INDEX idx_extraction_queue_document ON public.extraction_queue(document_id);
CREATE INDEX idx_extraction_queue_family ON public.extraction_queue(family_id);

-- Enable RLS
ALTER TABLE public.extraction_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Family members can view their extraction queue"
  ON public.extraction_queue
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can insert extraction queue items"
  ON public.extraction_queue
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can update extraction queue items"
  ON public.extraction_queue
  FOR UPDATE
  USING (true);

CREATE POLICY "Family owners can delete extraction queue items"
  ON public.extraction_queue
  FOR DELETE
  USING (is_family_owner(auth.uid(), family_id));

-- Function to get next extraction job from queue
CREATE OR REPLACE FUNCTION get_next_extraction_job()
RETURNS TABLE (
  queue_id UUID,
  document_id UUID,
  family_id UUID,
  chunk_index INTEGER,
  total_chunks INTEGER,
  retry_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  UPDATE extraction_queue
  SET status = 'processing',
      started_at = now()
  WHERE id = (
    SELECT id
    FROM extraction_queue
    WHERE status = 'pending'
    ORDER BY priority DESC, created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING 
    extraction_queue.id,
    extraction_queue.document_id,
    extraction_queue.family_id,
    extraction_queue.chunk_index,
    extraction_queue.total_chunks,
    extraction_queue.retry_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Update get_queue_stats to filter by job_id
CREATE OR REPLACE FUNCTION get_queue_stats(
  p_family_id UUID,
  p_job_id UUID DEFAULT NULL
)
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
  WHERE family_id = p_family_id
    AND (p_job_id IS NULL OR job_id = p_job_id);
$$;
-- ============================================
-- BEDROCK MONITORING VIEWS AND FUNCTIONS
-- Phase 1: Create unified monitoring infrastructure
-- ============================================

-- Create view for bedrock queue statistics
CREATE OR REPLACE VIEW bedrock_queue_stats AS
SELECT
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_items,
  COUNT(*) FILTER (WHERE status = 'processing') as processing_items,
  COUNT(*) FILTER (WHERE status = 'complete') as completed_items,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_items,
  ROUND(AVG(EXTRACT(EPOCH FROM (analyzed_at - created_at)) * 1000)::numeric, 1) as avg_processing_time_ms,
  ROUND((COUNT(*) FILTER (WHERE status = 'complete')::numeric / NULLIF(COUNT(*), 0)::numeric) * 100, 1) as success_rate
FROM bedrock_documents
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- Create function to get unified queue stats (legacy + bedrock)
CREATE OR REPLACE FUNCTION get_unified_queue_stats()
RETURNS TABLE (
  total_items BIGINT,
  queued_items BIGINT,
  processing_items BIGINT,
  completed_items BIGINT,
  failed_items BIGINT,
  avg_processing_time_sec NUMERIC,
  success_rate NUMERIC,
  bedrock_total BIGINT,
  bedrock_processing BIGINT,
  legacy_total BIGINT,
  legacy_processing BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH legacy_stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'pending') as queued,
      COUNT(*) FILTER (WHERE status = 'processing') as processing,
      COUNT(*) FILTER (WHERE status = 'completed') as completed,
      COUNT(*) FILTER (WHERE status = 'failed') as failed,
      ROUND(AVG(processing_time_ms) / 1000.0, 1) as avg_time
    FROM analysis_queue
    WHERE created_at >= NOW() - INTERVAL '24 hours'
  ),
  bedrock_stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'pending') as queued,
      COUNT(*) FILTER (WHERE status = 'processing') as processing,
      COUNT(*) FILTER (WHERE status = 'complete') as completed,
      COUNT(*) FILTER (WHERE status = 'failed') as failed,
      ROUND(AVG(EXTRACT(EPOCH FROM (analyzed_at - created_at))), 1) as avg_time
    FROM bedrock_documents
    WHERE created_at >= NOW() - INTERVAL '24 hours'
  )
  SELECT
    (ls.total + bs.total)::BIGINT,
    (ls.queued + bs.queued)::BIGINT,
    (ls.processing + bs.processing)::BIGINT,
    (ls.completed + bs.completed)::BIGINT,
    (ls.failed + bs.failed)::BIGINT,
    ROUND(((ls.avg_time * ls.total + bs.avg_time * bs.total) / NULLIF(ls.total + bs.total, 0)), 1) as avg_time,
    ROUND(((ls.completed + bs.completed)::NUMERIC / NULLIF(ls.total + bs.total, 0)::NUMERIC) * 100, 1),
    bs.total::BIGINT,
    bs.processing::BIGINT,
    ls.total::BIGINT,
    ls.processing::BIGINT
  FROM legacy_stats ls, bedrock_stats bs;
END;
$$;

-- Create function to get bedrock performance metrics
CREATE OR REPLACE FUNCTION get_bedrock_performance_metrics(
  p_hours INTEGER DEFAULT 24
)
RETURNS TABLE (
  hour_bucket TIMESTAMP WITH TIME ZONE,
  documents_processed BIGINT,
  avg_processing_time_sec NUMERIC,
  success_count BIGINT,
  failure_count BIGINT,
  success_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('hour', created_at) as hour_bucket,
    COUNT(*)::BIGINT as documents_processed,
    ROUND(AVG(EXTRACT(EPOCH FROM (analyzed_at - created_at))), 1) as avg_processing_time_sec,
    COUNT(*) FILTER (WHERE status = 'complete')::BIGINT as success_count,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT as failure_count,
    ROUND((COUNT(*) FILTER (WHERE status = 'complete')::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC) * 100, 1) as success_rate
  FROM bedrock_documents
  WHERE created_at >= NOW() - (p_hours || ' hours')::INTERVAL
  GROUP BY date_trunc('hour', created_at)
  ORDER BY hour_bucket DESC;
END;
$$;

-- Create function to check bedrock system status
CREATE OR REPLACE FUNCTION get_bedrock_system_status()
RETURNS TABLE (
  total_families BIGINT,
  bedrock_enabled_families BIGINT,
  total_bedrock_docs BIGINT,
  docs_last_24h BIGINT,
  current_processing BIGINT,
  current_failed BIGINT,
  migration_progress_pct NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM families)::BIGINT,
    (SELECT COUNT(*) FROM families WHERE (metadata->>'bedrock_enabled')::boolean = true)::BIGINT,
    (SELECT COUNT(*) FROM bedrock_documents)::BIGINT,
    (SELECT COUNT(*) FROM bedrock_documents WHERE created_at >= NOW() - INTERVAL '24 hours')::BIGINT,
    (SELECT COUNT(*) FROM bedrock_documents WHERE status = 'processing')::BIGINT,
    (SELECT COUNT(*) FROM bedrock_documents WHERE status = 'failed')::BIGINT,
    ROUND(
      (SELECT COUNT(*) FROM families WHERE (metadata->>'bedrock_enabled')::boolean = true)::NUMERIC / 
      NULLIF((SELECT COUNT(*) FROM families), 0)::NUMERIC * 100,
      1
    );
END;
$$;

COMMENT ON FUNCTION get_unified_queue_stats() IS 'Returns combined statistics from both legacy analysis_queue and bedrock_documents';
COMMENT ON FUNCTION get_bedrock_performance_metrics(INTEGER) IS 'Returns hourly performance metrics for Bedrock document processing';
COMMENT ON FUNCTION get_bedrock_system_status() IS 'Returns overall Bedrock system adoption and health status';
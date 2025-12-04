-- Drop and recreate get_unified_queue_stats with correct return type
DROP FUNCTION IF EXISTS get_unified_queue_stats();

CREATE OR REPLACE FUNCTION get_unified_queue_stats()
RETURNS TABLE (
  source TEXT,
  total BIGINT,
  queued BIGINT,
  processing BIGINT,
  completed BIGINT,
  failed BIGINT,
  avg_processing_time_seconds NUMERIC
) AS $$
BEGIN
  -- Bedrock stats (NEW system)
  RETURN QUERY
  SELECT
    'bedrock'::TEXT as source,
    COUNT(*)::BIGINT as total,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as queued,
    COUNT(*) FILTER (WHERE status = 'processing')::BIGINT as processing,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT as failed,
    ROUND(AVG(EXTRACT(EPOCH FROM (analyzed_at - created_at))) FILTER (WHERE analyzed_at IS NOT NULL), 1) as avg_processing_time_seconds
  FROM bedrock_documents
  WHERE created_at >= NOW() - INTERVAL '24 hours';

  -- Legacy stats (for comparison during migration)
  RETURN QUERY
  SELECT
    'legacy'::TEXT as source,
    COUNT(*)::BIGINT as total,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as queued,
    COUNT(*) FILTER (WHERE status = 'processing')::BIGINT as processing,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT as failed,
    ROUND(AVG(processing_time_ms / 1000.0) FILTER (WHERE processing_time_ms IS NOT NULL), 1) as avg_processing_time_seconds
  FROM analysis_queue
  WHERE created_at >= NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
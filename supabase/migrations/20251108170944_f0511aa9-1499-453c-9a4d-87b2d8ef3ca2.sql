-- Phase 3: Add timeout detection function and auto-recovery
CREATE OR REPLACE FUNCTION public.detect_and_recover_stuck_queue_items()
RETURNS TABLE(
  recovered_count INTEGER,
  failed_count INTEGER,
  retried_count INTEGER
) AS $$
DECLARE
  v_recovered INTEGER := 0;
  v_failed INTEGER := 0;
  v_retried INTEGER := 0;
BEGIN
  -- Mark items stuck in processing > 10 minutes as failed
  UPDATE analysis_queue
  SET 
    status = 'failed',
    error_message = 'Timeout: Processing exceeded 10 minutes without heartbeat',
    completed_at = NOW()
  WHERE status = 'processing'
    AND (
      -- Either started over 10 mins ago with no recent update
      (started_at < NOW() - INTERVAL '10 minutes' AND updated_at < NOW() - INTERVAL '10 minutes')
      -- Or started over 10 mins ago and never updated
      OR (started_at < NOW() - INTERVAL '10 minutes' AND updated_at IS NULL)
    );
  
  GET DIAGNOSTICS v_failed = ROW_COUNT;

  -- Auto-retry failed items that haven't exceeded max retries
  UPDATE analysis_queue
  SET 
    status = 'pending',
    error_message = NULL,
    started_at = NULL,
    completed_at = NULL,
    retry_count = retry_count + 1
  WHERE status = 'failed'
    AND retry_count < max_retries
    AND completed_at > NOW() - INTERVAL '5 minutes'; -- Only retry recent failures
  
  GET DIAGNOSTICS v_retried = ROW_COUNT;

  -- Reset orphaned document_analysis_status records
  UPDATE document_analysis_status das
  SET 
    status = 'pending',
    error_message = 'Recovered from stuck state',
    started_at = NULL
  WHERE status IN ('extracting', 'analyzing')
    AND started_at < NOW() - INTERVAL '10 minutes'
    AND NOT EXISTS (
      SELECT 1 FROM analysis_queue aq
      WHERE aq.document_id = das.document_id
      AND aq.status = 'processing'
    );
  
  GET DIAGNOSTICS v_recovered = ROW_COUNT;

  -- Update stuck jobs
  UPDATE analysis_jobs aj
  SET 
    status = 'failed',
    error_message = 'Job timeout: No progress for over 10 minutes',
    completed_at = NOW()
  WHERE status = 'processing'
    AND started_at < NOW() - INTERVAL '15 minutes'
    AND NOT EXISTS (
      SELECT 1 FROM analysis_queue aq
      WHERE aq.job_id = aj.id
      AND aq.status IN ('pending', 'processing')
    );

  RETURN QUERY SELECT v_recovered, v_failed, v_retried;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create analysis metrics table for monitoring
CREATE TABLE IF NOT EXISTS public.analysis_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES analysis_jobs(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'processing_time', 'error_rate', 'queue_depth', etc.
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_metrics_job_id ON analysis_metrics(job_id);
CREATE INDEX IF NOT EXISTS idx_analysis_metrics_type_timestamp ON analysis_metrics(metric_type, timestamp DESC);

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule automatic cleanup every 5 minutes
-- First, unschedule any existing job with this name
SELECT cron.unschedule('auto-recover-stuck-analysis') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'auto-recover-stuck-analysis'
);

-- Schedule the new job
SELECT cron.schedule(
  'auto-recover-stuck-analysis',
  '*/5 * * * *', -- Every 5 minutes
  $$SELECT public.detect_and_recover_stuck_queue_items();$$
);
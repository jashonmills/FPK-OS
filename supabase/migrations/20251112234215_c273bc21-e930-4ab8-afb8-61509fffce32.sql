-- Enable pg_net extension for calling edge functions from database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to invoke the queue processor edge function
CREATE OR REPLACE FUNCTION public.process_queue_worker()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_response_id BIGINT;
BEGIN
  -- Call the process-queue-job edge function using pg_net
  SELECT net.http_post(
    url := 'https://pnxwemmpxldriwaomiey.supabase.co/functions/v1/process-queue-job',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueHdlbW1weGxkcml3YW9taWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTQ4OTcsImV4cCI6MjA3NTU3MDg5N30.zASmJMJUvvKq2E87YhVALYJIhSbjoZnFD1QFB9v8Ar4'
    ),
    body := '{}'::jsonb
  ) INTO v_response_id;
  
  -- Log the request ID for debugging
  RAISE NOTICE 'Queue processor invoked with request ID: %', v_response_id;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't crash the cron job
    RAISE WARNING 'Queue processor error: %', SQLERRM;
END;
$$;

-- Remove any existing queue processor schedule
SELECT cron.unschedule('auto-process-queue') 
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'auto-process-queue'
);

-- Schedule queue processor to run every 15 seconds
SELECT cron.schedule(
  'auto-process-queue',
  '15 seconds',
  $$SELECT public.process_queue_worker();$$
);
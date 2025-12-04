-- Phase 1: Cross-Device Time Clock Sync - Database Schema Enhancement

-- Add unique constraint to prevent duplicate active sessions per user
ALTER TABLE public.active_time_sessions
ADD CONSTRAINT active_time_sessions_user_id_unique UNIQUE (user_id);

-- Add index for faster user session queries
CREATE INDEX IF NOT EXISTS idx_active_time_sessions_user_id 
ON public.active_time_sessions(user_id);

-- Add index for finding stale sessions
CREATE INDEX IF NOT EXISTS idx_active_time_sessions_last_heartbeat 
ON public.active_time_sessions(last_heartbeat);

-- Helper function to find and cleanup stale sessions (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_stale_sessions(hours_threshold INTEGER DEFAULT 24)
RETURNS TABLE(
  session_id UUID,
  user_id UUID,
  project_id UUID,
  hours_logged NUMERIC,
  was_stale BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ats.id as session_id,
    ats.user_id,
    ats.project_id,
    ROUND(EXTRACT(EPOCH FROM (NOW() - ats.start_time)) / 3600, 2) as hours_logged,
    (NOW() - ats.last_heartbeat) > (hours_threshold || ' hours')::INTERVAL as was_stale
  FROM public.active_time_sessions ats
  WHERE (NOW() - ats.last_heartbeat) > (hours_threshold || ' hours')::INTERVAL;
END;
$function$;
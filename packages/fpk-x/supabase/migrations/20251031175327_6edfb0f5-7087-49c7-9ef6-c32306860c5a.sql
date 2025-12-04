-- Drop old 2-parameter versions that are causing "function is not unique" errors
-- This leaves only the new 3-parameter versions that query both manual logs AND document_metrics

DROP FUNCTION IF EXISTS public.get_iep_goal_progress(uuid, uuid);
DROP FUNCTION IF EXISTS public.get_weekly_mood_counts(uuid, uuid, integer);
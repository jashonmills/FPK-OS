-- Fix duplicate get_coach_streak function causing orchestrator failures
-- This is preventing the knowledge pack from loading and causing intermittent response failures

-- Drop all versions of get_coach_streak to resolve ambiguity
DROP FUNCTION IF EXISTS get_coach_streak(uuid);
DROP FUNCTION IF EXISTS get_coach_streak(text);
DROP FUNCTION IF EXISTS get_coach_streak;

-- Recreate the function with explicit type signature
CREATE OR REPLACE FUNCTION get_coach_streak(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_streak integer;
BEGIN
  -- Calculate current streak from phoenix_conversations
  SELECT COALESCE(COUNT(DISTINCT DATE(created_at)), 0)
  INTO v_streak
  FROM phoenix_conversations
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '30 days'
    AND created_at::date >= (
      SELECT MAX(last_active_date)
      FROM (
        SELECT DATE(created_at) as last_active_date
        FROM phoenix_conversations
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT 1
      ) recent
    );
  
  RETURN COALESCE(v_streak, 0);
END;
$$;
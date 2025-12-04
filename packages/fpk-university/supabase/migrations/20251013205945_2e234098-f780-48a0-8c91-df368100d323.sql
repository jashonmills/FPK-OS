-- Fix critical bug in get_coach_topic_breakdown ORDER BY clause
-- The issue: ORDER BY was referencing 'study_minutes' ambiguously
-- The fix: Explicitly reference the subquery alias 'topic_data.study_minutes'

CREATE OR REPLACE FUNCTION public.get_coach_topic_breakdown(
  p_user_id UUID,
  p_date_range TEXT DEFAULT 'all_time'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
  v_start_date := CASE p_date_range
    WHEN 'last_7_days' THEN NOW() - INTERVAL '7 days'
    WHEN 'last_30_days' THEN NOW() - INTERVAL '30 days'
    ELSE '1970-01-01'::TIMESTAMP WITH TIME ZONE
  END;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'topic', COALESCE(topic, 'General Study'),
      'study_time', study_minutes,
      'mastery_score', ROUND(avg_mastery, 1),
      'session_count', session_count
    )
  )
  INTO v_result
  FROM (
    SELECT 
      ss.topic,
      COUNT(DISTINCT ss.id) as session_count,
      COUNT(st.id) * 5 as study_minutes,
      AVG(
        CASE 
          WHEN array_length(ss.score_history, 1) > 0 THEN
            (SELECT AVG(s::NUMERIC) FROM unnest(ss.score_history) s)
          ELSE 0
        END
      ) as avg_mastery
    FROM socratic_sessions ss
    LEFT JOIN socratic_turns st ON st.session_id = ss.id
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND ss.created_at >= v_start_date
    GROUP BY ss.topic
  ) topic_data
  ORDER BY topic_data.study_minutes DESC;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;
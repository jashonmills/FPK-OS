-- Create comprehensive analytics functions for the Coach Pro dashboard

-- Function: Get KPIs (Key Performance Indicators)
CREATE OR REPLACE FUNCTION public.get_coach_dashboard_kpis(
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
  v_total_study_time INTEGER := 0;
  v_total_sessions INTEGER := 0;
  v_current_streak INTEGER := 0;
  v_average_mastery NUMERIC := 0;
BEGIN
  -- Calculate start date based on range
  v_start_date := CASE p_date_range
    WHEN 'last_7_days' THEN NOW() - INTERVAL '7 days'
    WHEN 'last_30_days' THEN NOW() - INTERVAL '30 days'
    ELSE '1970-01-01'::TIMESTAMP WITH TIME ZONE
  END;
  
  -- Total study time (minutes from socratic turns)
  SELECT COALESCE(COUNT(*) * 5, 0)
  INTO v_total_study_time
  FROM socratic_turns st
  JOIN socratic_sessions ss ON ss.id = st.session_id
  WHERE ss.user_id = p_user_id
  AND ss.source = 'coach_portal'
  AND st.created_at >= v_start_date;
  
  -- Total sessions
  SELECT COUNT(*)
  INTO v_total_sessions
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND source = 'coach_portal'
  AND created_at >= v_start_date;
  
  -- Current streak (consecutive days with activity)
  SELECT get_coach_streak(p_user_id, 'coach_portal')
  INTO v_current_streak;
  
  -- Average mastery
  SELECT COALESCE(AVG(
    CASE 
      WHEN array_length(score_history, 1) > 0 THEN
        (SELECT AVG(s::NUMERIC) FROM unnest(score_history) s)
      ELSE 0
    END
  ), 0)
  INTO v_average_mastery
  FROM socratic_sessions
  WHERE user_id = p_user_id
  AND source = 'coach_portal'
  AND created_at >= v_start_date;
  
  RETURN jsonb_build_object(
    'total_study_time', v_total_study_time,
    'total_sessions', v_total_sessions,
    'current_streak', v_current_streak,
    'average_mastery', ROUND(v_average_mastery, 1)
  );
END;
$$;

-- Function: Get activity heatmap data
CREATE OR REPLACE FUNCTION public.get_coach_activity_heatmap(
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
    ELSE NOW() - INTERVAL '365 days' -- Limit to 1 year for heatmap
  END;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', day_date::TEXT,
      'study_time', COALESCE(study_minutes, 0)
    ) ORDER BY day_date
  )
  INTO v_result
  FROM (
    SELECT 
      DATE(st.created_at) as day_date,
      COUNT(*) * 5 as study_minutes
    FROM socratic_turns st
    JOIN socratic_sessions ss ON ss.id = st.session_id
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND st.created_at >= v_start_date
    GROUP BY DATE(st.created_at)
  ) daily_data;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;

-- Function: Get time by day of week
CREATE OR REPLACE FUNCTION public.get_coach_time_by_day(
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
      'day', day_name,
      'study_time', COALESCE(study_minutes, 0)
    ) ORDER BY day_num
  )
  INTO v_result
  FROM (
    SELECT 
      EXTRACT(DOW FROM st.created_at)::INTEGER as day_num,
      TO_CHAR(st.created_at, 'Day') as day_name,
      COUNT(*) * 5 as study_minutes
    FROM socratic_turns st
    JOIN socratic_sessions ss ON ss.id = st.session_id
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND st.created_at >= v_start_date
    GROUP BY EXTRACT(DOW FROM st.created_at), TO_CHAR(st.created_at, 'Day')
  ) day_data;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;

-- Function: Get time by hour of day
CREATE OR REPLACE FUNCTION public.get_coach_time_by_hour(
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
      'hour', hour_of_day,
      'study_time', COALESCE(study_minutes, 0)
    ) ORDER BY hour_of_day
  )
  INTO v_result
  FROM (
    SELECT 
      EXTRACT(HOUR FROM st.created_at)::INTEGER as hour_of_day,
      COUNT(*) * 5 as study_minutes
    FROM socratic_turns st
    JOIN socratic_sessions ss ON ss.id = st.session_id
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND st.created_at >= v_start_date
    GROUP BY EXTRACT(HOUR FROM st.created_at)
  ) hour_data;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;

-- Function: Get topic breakdown
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
  ORDER BY study_minutes DESC;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;

-- Function: Get mastery over time
CREATE OR REPLACE FUNCTION public.get_coach_mastery_over_time(
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
    ELSE NOW() - INTERVAL '90 days' -- Limit to 90 days for line chart
  END;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', week_start::TEXT,
      'avg_mastery', ROUND(avg_mastery, 2)
    ) ORDER BY week_start
  )
  INTO v_result
  FROM (
    SELECT 
      DATE_TRUNC('week', ss.created_at)::DATE as week_start,
      AVG(
        CASE 
          WHEN array_length(ss.score_history, 1) > 0 THEN
            (SELECT AVG(s::NUMERIC) FROM unnest(ss.score_history) s)
          ELSE 0
        END
      ) as avg_mastery
    FROM socratic_sessions ss
    WHERE ss.user_id = p_user_id
    AND ss.source = 'coach_portal'
    AND ss.created_at >= v_start_date
    GROUP BY DATE_TRUNC('week', ss.created_at)
  ) weekly_data;
  
  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;
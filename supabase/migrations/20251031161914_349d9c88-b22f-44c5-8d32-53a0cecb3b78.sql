-- Enhanced RPC function for mood distribution that works with parent_logs AND document_metrics
CREATE OR REPLACE FUNCTION public.get_weekly_mood_counts(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE(
  day_of_week TEXT,
  day_order INTEGER,
  mood TEXT,
  count BIGINT
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH mood_from_logs AS (
    -- Get mood from parent logs
    SELECT 
      TRIM(TO_CHAR(pl.log_date, 'Day')) AS day_of_week,
      CAST(TO_CHAR(pl.log_date, 'D') AS INTEGER) AS day_order,
      pl.mood,
      COUNT(*) AS count
    FROM public.parent_logs pl
    WHERE pl.family_id = p_family_id 
      AND pl.student_id = p_student_id
      AND pl.log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND pl.mood IS NOT NULL
    GROUP BY TRIM(TO_CHAR(pl.log_date, 'Day')), CAST(TO_CHAR(pl.log_date, 'D') AS INTEGER), pl.mood
  ),
  mood_from_metrics AS (
    -- Get mood from document_metrics where applicable
    SELECT 
      TRIM(TO_CHAR(dm.measurement_date, 'Day')) AS day_of_week,
      CAST(TO_CHAR(dm.measurement_date, 'D') AS INTEGER) AS day_order,
      dm.metric_name AS mood,
      COUNT(*) AS count
    FROM public.document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type IN ('mood_tracking', 'emotional_state', 'behavioral_observation')
      AND dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND dm.metric_name IS NOT NULL
    GROUP BY TRIM(TO_CHAR(dm.measurement_date, 'Day')), CAST(TO_CHAR(dm.measurement_date, 'D') AS INTEGER), dm.metric_name
  )
  -- Union both sources
  SELECT * FROM mood_from_logs
  UNION ALL
  SELECT * FROM mood_from_metrics
  ORDER BY day_order, mood;
END;
$$;

-- Enhanced RPC function for top priority goals that handles empty progress_tracking
CREATE OR REPLACE FUNCTION public.get_top_priority_goals_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT NULL
)
RETURNS TABLE(
  goal_title TEXT,
  goal_type TEXT,
  current_value NUMERIC,
  target_value NUMERIC,
  progress_percentage NUMERIC,
  target_date DATE,
  is_active BOOLEAN
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH goal_metrics AS (
    -- Attempt to calculate progress from document_metrics if available
    SELECT 
      g.id as goal_id,
      AVG(dm.metric_value) as avg_current_value
    FROM goals g
    LEFT JOIN document_metrics dm ON 
      dm.family_id = g.family_id AND
      dm.student_id = g.student_id AND
      dm.metric_type = 'goal_progress' AND
      LOWER(dm.metric_name) LIKE '%' || LOWER(g.goal_type) || '%'
    WHERE g.family_id = p_family_id
      AND g.student_id = p_student_id
      AND g.is_active = true
    GROUP BY g.id
  )
  SELECT 
    g.goal_title,
    g.goal_type,
    COALESCE(gm.avg_current_value, g.current_value) as current_value,
    g.target_value,
    CASE 
      WHEN g.target_value > 0 THEN 
        ROUND((COALESCE(gm.avg_current_value, g.current_value) / g.target_value) * 100, 1)
      ELSE 0
    END as progress_percentage,
    g.target_date,
    g.is_active
  FROM goals g
  LEFT JOIN goal_metrics gm ON g.id = gm.goal_id
  WHERE g.family_id = p_family_id
    AND g.student_id = p_student_id
    AND g.is_active = true
    AND (
      p_days IS NULL OR
      g.created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  ORDER BY 
    CASE 
      WHEN g.target_value > 0 THEN (COALESCE(gm.avg_current_value, g.current_value) / g.target_value)
      ELSE 0
    END ASC
  LIMIT 5;
END;
$$;

-- Enhanced RPC for IEP goal progress that works with goals table directly
CREATE OR REPLACE FUNCTION public.get_iep_goal_progress(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT NULL
)
RETURNS TABLE(
  goal_category TEXT,
  goal_count BIGINT,
  avg_progress NUMERIC,
  active_goals BIGINT
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH goal_data AS (
    SELECT 
      g.goal_type,
      g.id,
      g.is_active,
      g.current_value,
      g.target_value,
      CASE 
        WHEN g.target_value > 0 THEN (g.current_value / g.target_value) * 100
        ELSE 0
      END as calculated_progress
    FROM goals g
    WHERE g.family_id = p_family_id
      AND g.student_id = p_student_id
      AND (
        p_days IS NULL OR
        g.created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
  ),
  progress_data AS (
    SELECT 
      pt.metric_type,
      pt.progress_percentage
    FROM progress_tracking pt
    WHERE pt.family_id = p_family_id
      AND pt.student_id = p_student_id
      AND (
        p_days IS NULL OR
        pt.period_start >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
  )
  SELECT 
    COALESCE(gd.goal_type, pd.metric_type) as goal_category,
    COUNT(DISTINCT gd.id) as goal_count,
    COALESCE(
      AVG(pd.progress_percentage),
      AVG(gd.calculated_progress),
      0
    ) as avg_progress,
    COUNT(DISTINCT gd.id) FILTER (WHERE gd.is_active = true) as active_goals
  FROM goal_data gd
  FULL OUTER JOIN progress_data pd ON pd.metric_type = gd.goal_type
  GROUP BY COALESCE(gd.goal_type, pd.metric_type)
  HAVING COUNT(DISTINCT gd.id) > 0 OR AVG(pd.progress_percentage) IS NOT NULL
  ORDER BY avg_progress DESC;
END;
$$;
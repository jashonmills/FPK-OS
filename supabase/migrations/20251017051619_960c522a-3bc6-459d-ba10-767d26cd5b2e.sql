-- Fix get_daily_log_counts: resolve ambiguous log_date column
CREATE OR REPLACE FUNCTION public.get_daily_log_counts(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT 30)
RETURNS TABLE(log_date date, incident_count bigint, parent_count bigint, educator_count bigint, total_count bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (p_days || ' days')::INTERVAL,
      CURRENT_DATE,
      '1 day'::INTERVAL
    )::DATE AS log_date
  ),
  incident_counts AS (
    SELECT il.incident_date AS log_date, COUNT(*) AS count
    FROM public.incident_logs il
    WHERE il.family_id = p_family_id AND il.student_id = p_student_id
      AND il.incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY il.incident_date
  ),
  parent_counts AS (
    SELECT pl.log_date, COUNT(*) AS count
    FROM public.parent_logs pl
    WHERE pl.family_id = p_family_id AND pl.student_id = p_student_id
      AND pl.log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY pl.log_date
  ),
  educator_counts AS (
    SELECT el.log_date, COUNT(*) AS count
    FROM public.educator_logs el
    WHERE el.family_id = p_family_id AND el.student_id = p_student_id
      AND el.log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY el.log_date
  )
  SELECT 
    ds.log_date,
    COALESCE(ic.count, 0) AS incident_count,
    COALESCE(pc.count, 0) AS parent_count,
    COALESCE(ec.count, 0) AS educator_count,
    COALESCE(ic.count, 0) + COALESCE(pc.count, 0) + COALESCE(ec.count, 0) AS total_count
  FROM date_series ds
  LEFT JOIN incident_counts ic ON ds.log_date = ic.log_date
  LEFT JOIN parent_counts pc ON ds.log_date = pc.log_date
  LEFT JOIN educator_counts ec ON ds.log_date = ec.log_date
  ORDER BY ds.log_date;
END;
$function$;

-- Fix get_sleep_summary_data: resolve ambiguous sleep_date column
CREATE OR REPLACE FUNCTION public.get_sleep_summary_data(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT 30)
RETURNS TABLE(sleep_date date, total_sleep_hours numeric, sleep_quality_rating integer, nap_taken boolean)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sr.sleep_date,
    sr.total_sleep_hours,
    sr.sleep_quality_rating,
    sr.nap_taken
  FROM public.sleep_records sr
  WHERE sr.family_id = p_family_id 
    AND sr.student_id = p_student_id
    AND sr.sleep_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  ORDER BY sr.sleep_date;
END;
$function$;

-- Fix get_environmental_impact_data: fix type mismatch
CREATE OR REPLACE FUNCTION public.get_environmental_impact_data(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT NULL::integer)
RETURNS TABLE(factor_category text, positive_correlation numeric, negative_correlation numeric, sample_size bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH behavior_scores AS (
    SELECT 
      dm.measurement_date,
      AVG(CASE WHEN dm.metric_value >= 7 THEN 1 ELSE 0 END) as daily_success_rate
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND (
        p_days IS NULL OR
        dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
    GROUP BY dm.measurement_date
  ),
  weather_impact AS (
    SELECT 
      'Weather Conditions' as factor_category,
      CORR(
        CASE WHEN il.weather_condition IN ('Clear', 'Sunny') THEN 1 ELSE 0 END::NUMERIC,
        bs.daily_success_rate::NUMERIC
      )::NUMERIC as positive_correlation,
      CORR(
        CASE WHEN il.weather_condition IN ('Rain', 'Storm', 'Overcast') THEN 1 ELSE 0 END::NUMERIC,
        bs.daily_success_rate::NUMERIC
      )::NUMERIC as negative_correlation,
      COUNT(*) as sample_size
    FROM incident_logs il
    JOIN behavior_scores bs ON il.incident_date = bs.measurement_date
    WHERE il.family_id = p_family_id
      AND il.student_id = p_student_id
      AND (
        p_days IS NULL OR
        il.incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
    GROUP BY factor_category
  ),
  air_quality_impact AS (
    SELECT 
      'Air Quality' as factor_category,
      CORR(
        CASE WHEN il.aqi_us < 50 THEN 1 ELSE 0 END::NUMERIC,
        bs.daily_success_rate::NUMERIC
      )::NUMERIC as positive_correlation,
      CORR(
        CASE WHEN il.aqi_us > 100 THEN 1 ELSE 0 END::NUMERIC,
        bs.daily_success_rate::NUMERIC
      )::NUMERIC as negative_correlation,
      COUNT(*) as sample_size
    FROM incident_logs il
    JOIN behavior_scores bs ON il.incident_date = bs.measurement_date
    WHERE il.family_id = p_family_id
      AND il.student_id = p_student_id
      AND il.aqi_us IS NOT NULL
      AND (
        p_days IS NULL OR
        il.incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
    GROUP BY factor_category
  )
  SELECT * FROM weather_impact
  UNION ALL
  SELECT * FROM air_quality_impact;
END;
$function$;

-- Add p_days parameter to get_weekly_mood_counts
CREATE OR REPLACE FUNCTION public.get_weekly_mood_counts(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT 7)
RETURNS TABLE(day_of_week text, day_order integer, mood text, count bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
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
  ORDER BY CAST(TO_CHAR(pl.log_date, 'D') AS INTEGER), pl.mood;
END;
$function$;

-- Add p_days parameter to get_top_priority_goals_data
CREATE OR REPLACE FUNCTION public.get_top_priority_goals_data(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT NULL::integer)
RETURNS TABLE(goal_title text, goal_type text, current_value numeric, target_value numeric, progress_percentage numeric, target_date date, is_active boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    g.goal_title,
    g.goal_type,
    g.current_value,
    g.target_value,
    CASE 
      WHEN g.target_value > 0 THEN ROUND((g.current_value / g.target_value) * 100, 1)
      ELSE 0
    END as progress_percentage,
    g.target_date,
    g.is_active
  FROM goals g
  WHERE g.family_id = p_family_id
    AND g.student_id = p_student_id
    AND g.is_active = true
  ORDER BY 
    CASE 
      WHEN g.target_value > 0 THEN (g.current_value / g.target_value)
      ELSE 0
    END ASC
  LIMIT 5;
$function$;

-- Add p_days parameter to get_iep_goal_progress
CREATE OR REPLACE FUNCTION public.get_iep_goal_progress(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT NULL::integer)
RETURNS TABLE(goal_category text, goal_count bigint, avg_progress numeric, active_goals bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    COALESCE(g.goal_type, pt.metric_type) as goal_category,
    COUNT(DISTINCT g.id) as goal_count,
    COALESCE(AVG(pt.progress_percentage), 0) as avg_progress,
    COUNT(DISTINCT g.id) FILTER (WHERE g.is_active = true) as active_goals
  FROM goals g
  FULL OUTER JOIN progress_tracking pt 
    ON pt.metric_type = g.goal_type 
    AND pt.family_id = g.family_id 
    AND pt.student_id = g.student_id
  WHERE (g.family_id = p_family_id OR pt.family_id = p_family_id)
    AND (g.student_id = p_student_id OR pt.student_id = p_student_id)
  GROUP BY COALESCE(g.goal_type, pt.metric_type)
  HAVING COUNT(DISTINCT g.id) > 0 OR AVG(pt.progress_percentage) IS NOT NULL
  ORDER BY avg_progress DESC;
$function$;

-- Fix get_academic_fluency_data to accept p_days parameter
CREATE OR REPLACE FUNCTION public.get_academic_fluency_data(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT 30, p_start_date date DEFAULT NULL::date, p_end_date date DEFAULT NULL::date)
RETURNS TABLE(measurement_date date, reading_fluency numeric, math_fluency numeric, reading_target numeric, math_target numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date,
    MAX(CASE 
      WHEN dm.metric_name ILIKE '%reading%' 
        AND (dm.metric_value IS NOT NULL OR dm.target_value IS NOT NULL)
      THEN COALESCE(dm.metric_value, dm.target_value)
    END) as reading_fluency,
    MAX(CASE 
      WHEN dm.metric_name ILIKE '%math%' 
        AND (dm.metric_value IS NOT NULL OR dm.target_value IS NOT NULL)
      THEN COALESCE(dm.metric_value, dm.target_value)
    END) as math_fluency,
    MAX(CASE 
      WHEN dm.metric_name ILIKE '%reading%' 
      THEN dm.target_value
    END) as reading_target,
    MAX(CASE 
      WHEN dm.metric_name ILIKE '%math%' 
      THEN dm.target_value
    END) as math_target
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND (dm.metric_type = 'academic_fluency' OR dm.metric_type = 'academic_performance')
    AND (
      (p_start_date IS NOT NULL AND p_end_date IS NOT NULL AND dm.measurement_date BETWEEN p_start_date AND p_end_date) OR
      (p_days IS NOT NULL AND dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL) OR
      (p_start_date IS NULL AND p_end_date IS NULL AND p_days IS NULL)
    )
  GROUP BY dm.measurement_date
  ORDER BY dm.measurement_date;
END;
$function$;
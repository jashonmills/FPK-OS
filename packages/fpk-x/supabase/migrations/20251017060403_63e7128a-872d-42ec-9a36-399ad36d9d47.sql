-- Phase 1 Fix: Add optional p_days parameter to RPC functions (corrected version)

-- Fix 1: get_sensory_profile_data - add optional p_days parameter
CREATE OR REPLACE FUNCTION public.get_sensory_profile_data(
  p_family_id uuid, 
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  sensory_category text, 
  intensity_level text, 
  frequency bigint, 
  avg_value numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    metric_name as sensory_category,
    CASE 
      WHEN AVG(metric_value) >= 7 THEN 'High'
      WHEN AVG(metric_value) >= 4 THEN 'Moderate'
      ELSE 'Low'
    END as intensity_level,
    COUNT(*) as frequency,
    AVG(metric_value) as avg_value
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'sensory_profile'
    AND (
      p_days IS NULL OR
      measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY metric_name
  ORDER BY metric_name, avg_value DESC;
$function$;

-- Fix 2: get_iep_goal_progress - add optional p_days parameter (uses period_start instead of tracking_date)
CREATE OR REPLACE FUNCTION public.get_iep_goal_progress(
  p_family_id uuid, 
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  goal_category text, 
  goal_count bigint, 
  avg_progress numeric, 
  active_goals bigint
)
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
    AND (
      p_days IS NULL OR
      pt.period_start >= CURRENT_DATE - (p_days || ' days')::INTERVAL OR
      g.created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY COALESCE(g.goal_type, pt.metric_type)
  HAVING COUNT(DISTINCT g.id) > 0 OR AVG(pt.progress_percentage) IS NOT NULL
  ORDER BY avg_progress DESC;
$function$;

-- Fix 3: get_top_priority_goals_data - add optional p_days parameter
CREATE OR REPLACE FUNCTION public.get_top_priority_goals_data(
  p_family_id uuid, 
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  goal_title text, 
  goal_type text, 
  current_value numeric, 
  target_value numeric, 
  progress_percentage numeric, 
  target_date date, 
  is_active boolean
)
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
    AND (
      p_days IS NULL OR
      g.created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  ORDER BY 
    CASE 
      WHEN g.target_value > 0 THEN (g.current_value / g.target_value)
      ELSE 0
    END ASC
  LIMIT 5;
$function$;
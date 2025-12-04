-- Fix IEP Goal Progress calculation to cap percentages at 100% and handle NULL targets
-- Bug: When target_value is NULL, metric_value was being used directly as percentage (e.g., 1450 minutes = 1450%)

DROP FUNCTION IF EXISTS public.get_iep_goal_progress(uuid, uuid, integer);

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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH goal_data AS (
    SELECT 
      g.goal_type,
      g.id,
      g.is_active,
      CASE 
        WHEN g.target_value > 0 THEN LEAST((g.current_value / g.target_value) * 100, 100)
        ELSE 0
      END as calculated_progress
    FROM goals g
    WHERE g.family_id = p_family_id
      AND g.student_id = p_student_id
      AND (p_days IS NULL OR g.created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL)
  ),
  progress_tracking_data AS (
    SELECT 
      pt.metric_type,
      LEAST(pt.progress_percentage, 100) as progress_percentage
    FROM progress_tracking pt
    WHERE pt.family_id = p_family_id
      AND pt.student_id = p_student_id
      AND (p_days IS NULL OR pt.period_start >= CURRENT_DATE - (p_days || ' days')::INTERVAL)
  ),
  doc_progress_data AS (
    SELECT 
      dm.metric_type,
      AVG(
        CASE 
          -- Only calculate percentage if we have BOTH metric_value AND target_value
          WHEN dm.target_value > 0 AND dm.metric_value IS NOT NULL 
            THEN LEAST((dm.metric_value / dm.target_value) * 100, 100)
          -- If no target, treat metric_value as a direct percentage IF it's reasonable (0-100)
          WHEN dm.target_value IS NULL AND dm.metric_value BETWEEN 0 AND 100
            THEN dm.metric_value
          -- Otherwise, we can't calculate progress
          ELSE 0
        END
      ) as avg_progress
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type IN ('goal_progress', 'academic_performance', 'behavioral_progress', 'service_delivery', 'task_engagement', 'communication')
      AND (p_days IS NULL OR dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL)
    GROUP BY dm.metric_type
  )
  SELECT 
    COALESCE(gd.goal_type, ptd.metric_type, dpd.metric_type) as goal_category,
    GREATEST(COUNT(DISTINCT gd.id), 1) as goal_count,
    LEAST(
      COALESCE(
        AVG(dpd.avg_progress),
        AVG(ptd.progress_percentage),
        AVG(gd.calculated_progress),
        0
      ),
      100
    ) as avg_progress,
    COUNT(DISTINCT gd.id) FILTER (WHERE gd.is_active = true) as active_goals
  FROM goal_data gd
  FULL OUTER JOIN progress_tracking_data ptd ON ptd.metric_type = gd.goal_type
  FULL OUTER JOIN doc_progress_data dpd ON dpd.metric_type = COALESCE(gd.goal_type, ptd.metric_type)
  GROUP BY COALESCE(gd.goal_type, ptd.metric_type, dpd.metric_type)
  HAVING COUNT(DISTINCT gd.id) > 0 OR AVG(ptd.progress_percentage) IS NOT NULL OR AVG(dpd.avg_progress) IS NOT NULL
  ORDER BY avg_progress DESC;
END;
$$;
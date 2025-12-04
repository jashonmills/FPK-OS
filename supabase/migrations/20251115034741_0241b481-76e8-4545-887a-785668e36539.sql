-- Fix ambiguous goal_id reference in get_goal_progress_timeline
DROP FUNCTION IF EXISTS public.get_goal_progress_timeline(UUID, DATE, DATE);

CREATE OR REPLACE FUNCTION public.get_goal_progress_timeline(
  p_goal_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  recorded_date DATE,
  progress_value NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT 
    pm.metric_date as recorded_date,
    pm.metric_value as progress_value
  FROM progress_metrics pm
  INNER JOIN goals g ON 
    pm.family_id = g.family_id 
    AND pm.student_id = g.student_id
    AND pm.metric_category = g.goal_type
  WHERE g.id = p_goal_id
    AND pm.metric_date BETWEEN p_start_date AND p_end_date
  ORDER BY pm.metric_date;
$$;
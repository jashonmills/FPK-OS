-- Create get_client_goals RPC
CREATE OR REPLACE FUNCTION public.get_client_goals(
  p_client_id UUID
)
RETURNS TABLE (
  id UUID,
  goal_title TEXT,
  goal_type TEXT,
  current_value NUMERIC,
  target_value NUMERIC,
  target_date DATE,
  is_active BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT 
    id,
    goal_title,
    goal_type,
    current_value,
    target_value,
    target_date,
    is_active
  FROM goals
  WHERE client_id = p_client_id
    AND is_active = true
  ORDER BY created_at DESC;
$$;

-- Create get_goal_progress_timeline RPC using progress_metrics
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
    metric_date as recorded_date,
    metric_value as progress_value
  FROM progress_metrics pm
  JOIN goals g ON pm.family_id = g.family_id 
    AND pm.student_id = g.student_id
    AND pm.metric_category = g.goal_type
  WHERE g.id = p_goal_id
    AND pm.metric_date BETWEEN p_start_date AND p_end_date
  ORDER BY pm.metric_date;
$$;
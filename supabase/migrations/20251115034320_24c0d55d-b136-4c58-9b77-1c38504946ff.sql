-- Drop and recreate get_client_goals with all necessary fields
DROP FUNCTION IF EXISTS public.get_client_goals(UUID);

CREATE OR REPLACE FUNCTION public.get_client_goals(
  p_client_id UUID
)
RETURNS TABLE (
  id UUID,
  goal_title TEXT,
  goal_description TEXT,
  goal_type TEXT,
  current_value NUMERIC,
  target_value NUMERIC,
  target_date DATE,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  progress_percentage NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT 
    id,
    goal_title,
    goal_description,
    goal_type,
    current_value,
    target_value,
    target_date,
    is_active,
    created_at,
    CASE 
      WHEN target_value > 0 THEN ROUND((current_value / target_value * 100)::numeric, 2)
      ELSE 0
    END as progress_percentage
  FROM goals
  WHERE client_id = p_client_id
    AND is_active = true
  ORDER BY created_at DESC;
$$;
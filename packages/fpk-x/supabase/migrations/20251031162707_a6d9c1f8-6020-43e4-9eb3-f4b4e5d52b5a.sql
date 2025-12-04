-- Fix save_chart_layout function to not rely on missing constraint
CREATE OR REPLACE FUNCTION public.save_chart_layout(
  p_family_id UUID,
  p_student_id UUID,
  p_tab_id TEXT,
  p_layout JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- First try to update existing record
  UPDATE user_chart_layouts
  SET 
    layout = p_layout,
    updated_at = now()
  WHERE family_id = p_family_id
    AND (student_id = p_student_id OR (student_id IS NULL AND p_student_id IS NULL))
    AND tab_id = p_tab_id;
  
  -- If no rows were updated, insert new record
  IF NOT FOUND THEN
    INSERT INTO user_chart_layouts (family_id, student_id, tab_id, layout)
    VALUES (p_family_id, p_student_id, p_tab_id, p_layout);
  END IF;
END;
$$;
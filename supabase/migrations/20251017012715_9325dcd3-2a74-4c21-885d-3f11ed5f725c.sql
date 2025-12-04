-- Fix get_academic_fluency_data to match actual metric names
DROP FUNCTION IF EXISTS get_academic_fluency_data(uuid, uuid, date, date);

CREATE OR REPLACE FUNCTION get_academic_fluency_data(
  p_family_id UUID,
  p_student_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  measurement_date DATE,
  reading_fluency NUMERIC,
  math_fluency NUMERIC,
  reading_target NUMERIC,
  math_target NUMERIC
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
      (p_start_date IS NULL AND p_end_date IS NULL) OR
      (dm.measurement_date BETWEEN p_start_date AND p_end_date)
    )
  GROUP BY dm.measurement_date
  ORDER BY dm.measurement_date;
END;
$$;
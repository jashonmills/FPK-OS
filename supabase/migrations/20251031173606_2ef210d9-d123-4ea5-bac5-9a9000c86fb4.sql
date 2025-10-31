-- Fix RPC functions to use correct column names from document_metrics table
-- The table has measurement_date, not metric_date
-- And uses metric_type for categorization, not metric_category

-- Drop and recreate get_incident_frequency_data with correct column references
DROP FUNCTION IF EXISTS get_incident_frequency_data(UUID, UUID, INTEGER);

CREATE OR REPLACE FUNCTION get_incident_frequency_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT NULL
)
RETURNS TABLE (
  log_date DATE,
  incident_count INTEGER,
  severity_avg NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date::DATE as log_date,
    COUNT(*)::INTEGER as incident_count,
    AVG(dm.metric_value) as severity_avg
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND (p_student_id IS NULL OR dm.student_id = p_student_id)
    AND dm.metric_type = 'behavioral_incident'
    AND (p_days IS NULL OR dm.measurement_date >= CURRENT_DATE - p_days)
  GROUP BY dm.measurement_date::DATE
  ORDER BY log_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate get_attention_span_data with correct column references
DROP FUNCTION IF EXISTS get_attention_span_data(UUID, UUID, INTEGER);

CREATE OR REPLACE FUNCTION get_attention_span_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT NULL
)
RETURNS TABLE (
  log_date DATE,
  avg_attention_minutes NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date::DATE as log_date,
    AVG(dm.metric_value) as avg_attention_minutes
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND (p_student_id IS NULL OR dm.student_id = p_student_id)
    AND (dm.metric_type = 'attention_span' OR dm.metric_name ILIKE '%attention%')
    AND (p_days IS NULL OR dm.measurement_date >= CURRENT_DATE - p_days)
  GROUP BY dm.measurement_date::DATE
  ORDER BY log_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_incident_frequency_data(UUID, UUID, INTEGER);
DROP FUNCTION IF EXISTS get_attention_span_data(UUID, UUID, INTEGER);

-- Create RPC function to get incident frequency data from document_metrics
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
    dm.metric_date::DATE as log_date,
    COUNT(*)::INTEGER as incident_count,
    AVG(dm.metric_value) as severity_avg
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND (p_student_id IS NULL OR dm.student_id = p_student_id)
    AND dm.metric_category = 'behavioral'
    AND dm.metric_name ILIKE '%incident%'
    AND (p_days IS NULL OR dm.metric_date >= CURRENT_DATE - p_days)
  GROUP BY dm.metric_date::DATE
  ORDER BY log_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to get attention span data from document_metrics
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
    dm.metric_date::DATE as log_date,
    AVG(dm.metric_value) as avg_attention_minutes
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND (p_student_id IS NULL OR dm.student_id = p_student_id)
    AND dm.metric_category = 'academic'
    AND dm.metric_name ILIKE '%attention%'
    AND (p_days IS NULL OR dm.metric_date >= CURRENT_DATE - p_days)
  GROUP BY dm.metric_date::DATE
  ORDER BY log_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
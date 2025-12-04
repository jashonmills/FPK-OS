-- OPERATION: DATA TRANSPARENCY - Phase 1 & 2
-- Add metric extraction tracking to bedrock_documents

ALTER TABLE bedrock_documents 
ADD COLUMN IF NOT EXISTS metrics_extracted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS extraction_attempted_at TIMESTAMPTZ;

-- Create get_extracted_metrics RPC for the Data Hub
CREATE OR REPLACE FUNCTION public.get_extracted_metrics(
  p_client_id UUID,
  p_metric_type TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  source_document_name TEXT,
  document_category TEXT,
  metric_type TEXT,
  metric_name TEXT,
  metric_value NUMERIC,
  target_value NUMERIC,
  measurement_date DATE,
  context TEXT,
  intervention_used TEXT,
  duration_minutes NUMERIC,
  metadata JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bm.id,
    bd.file_name as source_document_name,
    bd.category as document_category,
    bm.metric_type,
    bm.metric_name,
    bm.metric_value,
    bm.target_value,
    bm.measurement_date,
    bm.context,
    bm.intervention_used,
    bm.duration_minutes,
    bm.metadata
  FROM bedrock_metrics bm
  JOIN bedrock_documents bd ON bd.id = bm.document_id
  WHERE bm.client_id = p_client_id
    AND (p_metric_type IS NULL OR bm.metric_type = p_metric_type)
    AND (p_start_date IS NULL OR bm.measurement_date >= p_start_date)
    AND (p_end_date IS NULL OR bm.measurement_date <= p_end_date)
  ORDER BY bm.measurement_date DESC, bd.file_name, bm.metric_name;
END;
$$;

-- Create get_ai_activity_frequency RPC for Activity chart enhancement
CREATE OR REPLACE FUNCTION public.get_ai_activity_frequency(
  p_client_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  log_type TEXT,
  count BIGINT,
  log_date DATE,
  source TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_start DATE;
  v_end DATE;
BEGIN
  v_start := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '30 days');
  v_end := COALESCE(p_end_date, CURRENT_DATE);
  
  RETURN QUERY
  SELECT 
    bm.metric_type as log_type,
    COUNT(*)::BIGINT as count,
    bm.measurement_date as log_date,
    'ai_extracted'::TEXT as source
  FROM bedrock_metrics bm
  WHERE bm.client_id = p_client_id
    AND bm.metric_type IN ('behavior_frequency', 'behavioral_incident', 'incident')
    AND bm.measurement_date BETWEEN v_start AND v_end
  GROUP BY bm.metric_type, bm.measurement_date
  ORDER BY log_date DESC;
END;
$$;

-- Create get_ai_extracted_goals RPC for Goal chart enhancement
CREATE OR REPLACE FUNCTION public.get_ai_extracted_goals(
  p_client_id UUID
)
RETURNS TABLE (
  goal_id UUID,
  goal_title TEXT,
  goal_type TEXT,
  source_document TEXT,
  current_value NUMERIC,
  target_value NUMERIC,
  measurement_date DATE,
  progress_percentage NUMERIC,
  source TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  RETURN QUERY
  WITH goal_metrics AS (
    SELECT 
      bm.id as goal_id,
      bm.metric_name as goal_title,
      bm.metric_type as goal_type,
      bd.file_name as source_document,
      bm.metric_value as current_value,
      bm.target_value,
      bm.measurement_date,
      CASE 
        WHEN bm.target_value > 0 THEN 
          ROUND((bm.metric_value / bm.target_value) * 100, 1)
        ELSE 0
      END as progress_percentage,
      CASE
        WHEN bd.category ILIKE '%iep%' THEN 'IEP'
        WHEN bd.category ILIKE '%isp%' OR bd.category ILIKE '%plan%' THEN 'ISP'
        ELSE 'Document'
      END as source
    FROM bedrock_metrics bm
    JOIN bedrock_documents bd ON bd.id = bm.document_id
    WHERE bm.client_id = p_client_id
      AND bm.target_value IS NOT NULL
      AND bm.target_value > 0
      AND bm.metric_type IN ('academic_fluency', 'academic_performance', 'goal_progress', 
                             'communication', 'behavior_reduction', 'skill_acquisition')
  )
  SELECT DISTINCT ON (goal_title, goal_type)
    goal_id,
    goal_title,
    goal_type,
    source_document,
    current_value,
    target_value,
    measurement_date,
    progress_percentage,
    source
  FROM goal_metrics
  ORDER BY goal_title, goal_type, measurement_date DESC;
END;
$$;
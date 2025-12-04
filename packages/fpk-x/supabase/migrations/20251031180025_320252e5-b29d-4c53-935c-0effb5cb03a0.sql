-- Fix get_intervention_effectiveness_data to query BOTH incident_logs AND document_metrics
-- This ensures intervention effectiveness includes data from uploaded documents

DROP FUNCTION IF EXISTS public.get_intervention_effectiveness_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_intervention_effectiveness_data(
  p_family_id uuid, 
  p_student_id uuid, 
  p_days integer DEFAULT 30
)
RETURNS TABLE(
  log_date date, 
  incident_count bigint, 
  intervention_count bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (p_days || ' days')::INTERVAL,
      CURRENT_DATE,
      '1 day'::INTERVAL
    )::DATE AS log_date
  ),
  -- Manual incident logs
  manual_incidents AS (
    SELECT 
      incident_date AS log_date, 
      COUNT(*) AS incident_count,
      COUNT(*) FILTER (WHERE intervention_used IS NOT NULL AND intervention_used != '') AS intervention_count
    FROM public.incident_logs
    WHERE family_id = p_family_id 
      AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY incident_date
  ),
  -- Document-based incidents
  doc_incidents AS (
    SELECT 
      measurement_date::DATE AS log_date,
      COUNT(*) AS incident_count,
      COUNT(*) FILTER (WHERE intervention_used IS NOT NULL AND intervention_used != '') AS intervention_count
    FROM public.document_metrics
    WHERE family_id = p_family_id 
      AND student_id = p_student_id
      AND metric_type IN ('behavioral_incident', 'behavior_frequency')
      AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY measurement_date::DATE
  )
  SELECT 
    ds.log_date,
    COALESCE(mi.incident_count, 0) + COALESCE(di.incident_count, 0) AS incident_count,
    COALESCE(mi.intervention_count, 0) + COALESCE(di.intervention_count, 0) AS intervention_count
  FROM date_series ds
  LEFT JOIN manual_incidents mi ON ds.log_date = mi.log_date
  LEFT JOIN doc_incidents di ON ds.log_date = di.log_date
  ORDER BY ds.log_date;
END;
$$;
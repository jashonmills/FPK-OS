-- Fix Task Initiation chart to show continuous date range with zero-filling

DROP FUNCTION IF EXISTS public.get_task_initiation_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_task_initiation_data(
  p_family_id uuid, 
  p_student_id uuid, 
  p_days integer DEFAULT 30
)
RETURNS TABLE(
  measurement_date date,
  avg_latency_seconds numeric,
  task_complexity text,
  prompt_level text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH date_range AS (
    SELECT generate_series(
      CURRENT_DATE - p_days,
      CURRENT_DATE,
      '1 day'::interval
    )::DATE AS measurement_date
  ),
  actual_data AS (
    SELECT 
      dm.measurement_date::DATE as measurement_date,
      AVG(dm.metric_value) as avg_latency_seconds,
      dm.context as task_complexity,
      dm.intervention_used as prompt_level
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type = 'task_initiation'
      AND dm.measurement_date >= CURRENT_DATE - p_days
    GROUP BY dm.measurement_date::DATE, dm.context, dm.intervention_used
  )
  SELECT 
    dr.measurement_date,
    ad.avg_latency_seconds,
    ad.task_complexity,
    ad.prompt_level
  FROM date_range dr
  LEFT JOIN actual_data ad ON dr.measurement_date = ad.measurement_date
  ORDER BY dr.measurement_date;
END;
$$;
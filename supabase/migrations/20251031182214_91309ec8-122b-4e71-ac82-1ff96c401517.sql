-- Critical Fix: Implement proper time-series handling with complete date ranges
-- This ensures all charts show continuous date axes with zero values for missing data
-- Prevents misleading visualizations where gaps in data collection are hidden

-- 1. Update get_incident_frequency_data to fill time gaps
DROP FUNCTION IF EXISTS public.get_incident_frequency_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_incident_frequency_data(
  p_family_id uuid, 
  p_student_id uuid, 
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  log_date date, 
  incident_count integer, 
  severity_avg numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH date_range AS (
    SELECT generate_series(
      CURRENT_DATE - COALESCE(p_days, 30)::integer,
      CURRENT_DATE,
      '1 day'::interval
    )::DATE AS log_date
  ),
  manual_incidents AS (
    SELECT 
      il.incident_date::DATE as log_date,
      COUNT(*)::INTEGER as count,
      AVG(
        CASE il.severity
          WHEN 'mild' THEN 3
          WHEN 'moderate' THEN 5
          WHEN 'severe' THEN 8
          ELSE 5
        END
      ) as avg_severity
    FROM incident_logs il
    WHERE il.family_id = p_family_id
      AND (p_student_id IS NULL OR il.student_id = p_student_id)
      AND (p_days IS NULL OR il.incident_date >= CURRENT_DATE - p_days)
    GROUP BY il.incident_date::DATE
  ),
  doc_incidents AS (
    SELECT 
      dm.measurement_date::DATE as log_date,
      COUNT(*)::INTEGER as count,
      AVG(dm.metric_value) as avg_severity
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND (p_student_id IS NULL OR dm.student_id = p_student_id)
      AND dm.metric_type IN ('behavioral_incident', 'behavior_frequency')
      AND (p_days IS NULL OR dm.measurement_date >= CURRENT_DATE - p_days)
    GROUP BY dm.measurement_date::DATE
  )
  SELECT 
    dr.log_date,
    (COALESCE(mi.count, 0) + COALESCE(di.count, 0))::INTEGER as incident_count,
    CASE 
      WHEN (COALESCE(mi.count, 0) + COALESCE(di.count, 0)) > 0 THEN
        COALESCE(
          (mi.avg_severity * mi.count + di.avg_severity * di.count) / NULLIF(mi.count + di.count, 0),
          mi.avg_severity,
          di.avg_severity
        )
      ELSE NULL
    END as severity_avg
  FROM date_range dr
  LEFT JOIN manual_incidents mi ON dr.log_date = mi.log_date
  LEFT JOIN doc_incidents di ON dr.log_date = di.log_date
  ORDER BY dr.log_date;
END;
$$;

-- 2. Update get_sleep_summary_data to fill time gaps
DROP FUNCTION IF EXISTS public.get_sleep_summary_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_sleep_summary_data(
  p_family_id uuid, 
  p_student_id uuid, 
  p_days integer DEFAULT 30
)
RETURNS TABLE(
  sleep_date date, 
  total_sleep_hours numeric, 
  sleep_quality_rating integer, 
  nap_taken boolean
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
    )::DATE AS sleep_date
  ),
  actual_sleep AS (
    SELECT 
      sr.sleep_date,
      sr.total_sleep_hours,
      sr.sleep_quality_rating,
      sr.nap_taken
    FROM sleep_records sr
    WHERE sr.family_id = p_family_id 
      AND sr.student_id = p_student_id
      AND sr.sleep_date >= CURRENT_DATE - p_days
  )
  SELECT 
    dr.sleep_date,
    asl.total_sleep_hours,
    asl.sleep_quality_rating,
    asl.nap_taken
  FROM date_range dr
  LEFT JOIN actual_sleep asl ON dr.sleep_date = asl.sleep_date
  ORDER BY dr.sleep_date;
END;
$$;

-- 3. Update get_communication_progress_data to fill time gaps
DROP FUNCTION IF EXISTS public.get_communication_progress_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_communication_progress_data(
  p_family_id uuid, 
  p_student_id uuid, 
  p_days integer DEFAULT 60
)
RETURNS TABLE(
  measurement_date date, 
  expressive_language numeric, 
  receptive_language numeric, 
  pragmatic_skills numeric, 
  articulation numeric
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
      AVG(CASE WHEN dm.metric_name ILIKE '%expressive%' THEN dm.metric_value END) as expressive_language,
      AVG(CASE WHEN dm.metric_name ILIKE '%receptive%' THEN dm.metric_value END) as receptive_language,
      AVG(CASE WHEN dm.metric_name ILIKE '%pragmatic%' THEN dm.metric_value END) as pragmatic_skills,
      AVG(CASE WHEN dm.metric_name ILIKE '%articulation%' THEN dm.metric_value END) as articulation
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type IN ('communication', 'speech_therapy', 'language_skills')
      AND dm.measurement_date >= CURRENT_DATE - p_days
    GROUP BY dm.measurement_date::DATE
  )
  SELECT 
    dr.measurement_date,
    ad.expressive_language,
    ad.receptive_language,
    ad.pragmatic_skills,
    ad.articulation
  FROM date_range dr
  LEFT JOIN actual_data ad ON dr.measurement_date = ad.measurement_date
  ORDER BY dr.measurement_date;
END;
$$;

-- 4. Update get_attention_span_data to fill time gaps
DROP FUNCTION IF EXISTS public.get_attention_span_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_attention_span_data(
  p_family_id uuid, 
  p_student_id uuid, 
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  log_date date, 
  avg_attention_minutes numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH date_range AS (
    SELECT generate_series(
      CURRENT_DATE - COALESCE(p_days, 365)::integer,
      CURRENT_DATE,
      '1 day'::interval
    )::DATE AS log_date
  ),
  actual_data AS (
    SELECT 
      dm.measurement_date::DATE as log_date,
      AVG(dm.metric_value) as avg_attention_minutes
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND (p_student_id IS NULL OR dm.student_id = p_student_id)
      AND (dm.metric_type = 'attention_span' OR dm.metric_name ILIKE '%attention%')
      AND (p_days IS NULL OR dm.measurement_date >= CURRENT_DATE - p_days)
    GROUP BY dm.measurement_date::DATE
  )
  SELECT 
    dr.log_date,
    ad.avg_attention_minutes
  FROM date_range dr
  LEFT JOIN actual_data ad ON dr.log_date = ad.log_date
  ORDER BY dr.log_date;
END;
$$;

-- 5. Update get_intervention_effectiveness_data to fill time gaps
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
  WITH date_range AS (
    SELECT generate_series(
      CURRENT_DATE - p_days,
      CURRENT_DATE,
      '1 day'::interval
    )::DATE AS log_date
  ),
  manual_incidents AS (
    SELECT 
      incident_date AS log_date, 
      COUNT(*) AS incident_count,
      COUNT(*) FILTER (WHERE intervention_used IS NOT NULL AND intervention_used != '') AS intervention_count
    FROM incident_logs
    WHERE family_id = p_family_id 
      AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - p_days
    GROUP BY incident_date
  ),
  doc_incidents AS (
    SELECT 
      measurement_date::DATE AS log_date,
      COUNT(*) AS incident_count,
      COUNT(*) FILTER (WHERE intervention_used IS NOT NULL AND intervention_used != '') AS intervention_count
    FROM document_metrics
    WHERE family_id = p_family_id 
      AND student_id = p_student_id
      AND metric_type IN ('behavioral_incident', 'behavior_frequency')
      AND measurement_date >= CURRENT_DATE - p_days
    GROUP BY measurement_date::DATE
  )
  SELECT 
    dr.log_date,
    COALESCE(mi.incident_count, 0) + COALESCE(di.incident_count, 0) AS incident_count,
    COALESCE(mi.intervention_count, 0) + COALESCE(di.intervention_count, 0) AS intervention_count
  FROM date_range dr
  LEFT JOIN manual_incidents mi ON dr.log_date = mi.log_date
  LEFT JOIN doc_incidents di ON dr.log_date = di.log_date
  ORDER BY dr.log_date;
END;
$$;
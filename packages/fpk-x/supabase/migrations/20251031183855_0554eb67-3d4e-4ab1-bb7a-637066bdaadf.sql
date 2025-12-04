-- SYSTEMATIC FIX: Apply continuous date range + zero-filling to ALL remaining time-series charts
-- This migration ensures EVERY time-series chart has complete, continuous X-axes

-- 1. Fix get_peer_interaction_data
DROP FUNCTION IF EXISTS public.get_peer_interaction_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_peer_interaction_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  log_date date,
  positive_interactions bigint,
  negative_interactions bigint,
  initiated_interactions bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH date_range AS (
    SELECT generate_series(
      CURRENT_DATE - COALESCE(p_days, 365),
      CURRENT_DATE,
      '1 day'::interval
    )::DATE AS log_date
  ),
  actual_data AS (
    SELECT 
      dm.measurement_date::DATE as log_date,
      COUNT(*) FILTER (WHERE dm.metric_value >= 7) as positive_interactions,
      COUNT(*) FILTER (WHERE dm.metric_value < 4) as negative_interactions,
      COUNT(*) FILTER (WHERE dm.context ILIKE '%initiated%') as initiated_interactions
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type = 'social_interaction'
      AND (p_days IS NULL OR dm.measurement_date >= CURRENT_DATE - p_days)
    GROUP BY dm.measurement_date::DATE
  )
  SELECT 
    dr.log_date,
    COALESCE(ad.positive_interactions, 0) as positive_interactions,
    COALESCE(ad.negative_interactions, 0) as negative_interactions,
    COALESCE(ad.initiated_interactions, 0) as initiated_interactions
  FROM date_range dr
  LEFT JOIN actual_data ad ON dr.log_date = ad.log_date
  ORDER BY dr.log_date;
END;
$$;

-- 2. Fix get_attention_span_data (already has generate_series but needs COALESCE)
DROP FUNCTION IF EXISTS public.get_attention_span_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_attention_span_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(log_date date, avg_attention_minutes numeric)
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

-- 3. Fix get_fine_motor_data
DROP FUNCTION IF EXISTS public.get_fine_motor_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_fine_motor_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT 30
)
RETURNS TABLE(
  skill_name text,
  measurement_date date,
  mastery_percentage numeric,
  target_level numeric
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH recent_measurements AS (
    SELECT 
      dm.metric_name as skill_name,
      dm.measurement_date::DATE as measurement_date,
      dm.metric_value as mastery_percentage,
      dm.target_value as target_level,
      ROW_NUMBER() OVER (PARTITION BY dm.metric_name ORDER BY dm.measurement_date DESC) as rn
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type = 'fine_motor_skill'
      AND dm.measurement_date >= CURRENT_DATE - p_days
  )
  SELECT 
    skill_name,
    measurement_date,
    mastery_percentage,
    target_level
  FROM recent_measurements
  WHERE rn = 1
  ORDER BY skill_name;
END;
$$;

-- 4. Fix get_gross_motor_data
DROP FUNCTION IF EXISTS public.get_gross_motor_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION public.get_gross_motor_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT 30
)
RETURNS TABLE(
  skill_name text,
  measurement_date date,
  coordination_score numeric,
  balance_score numeric
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH recent_measurements AS (
    SELECT 
      dm.metric_name as skill_name,
      dm.measurement_date::DATE as measurement_date,
      AVG(dm.metric_value) as coordination_score,
      AVG(dm.target_value) as balance_score
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type = 'gross_motor_skill'
      AND dm.measurement_date >= CURRENT_DATE - p_days
    GROUP BY dm.metric_name, dm.measurement_date::DATE
  )
  SELECT 
    skill_name,
    measurement_date,
    coordination_score,
    balance_score
  FROM recent_measurements
  ORDER BY skill_name, measurement_date DESC;
END;
$$;
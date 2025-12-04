-- Phase 1: Update ALL RPC Functions to Support Historical Data (Temporal Synthesis)
-- This migration enables the "time machine" functionality by changing date filters
-- from created_at (upload date) to measurement_date (actual data occurrence date)
-- and supporting NULL for "all time" queries

-- 1. get_academic_fluency_data: Support all-time queries
DROP FUNCTION IF EXISTS get_academic_fluency_data(uuid, uuid, date, date);

CREATE OR REPLACE FUNCTION get_academic_fluency_data(
  p_family_id uuid,
  p_student_id uuid,
  p_start_date date DEFAULT NULL,
  p_end_date date DEFAULT NULL
)
RETURNS TABLE(
  measurement_date date,
  reading_fluency numeric,
  math_fluency numeric,
  reading_target numeric,
  math_target numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date,
    MAX(CASE WHEN dm.metric_name ILIKE '%reading%fluency%' THEN dm.metric_value END) as reading_fluency,
    MAX(CASE WHEN dm.metric_name ILIKE '%math%fluency%' OR dm.metric_name ILIKE '%math%fact%' THEN dm.metric_value END) as math_fluency,
    MAX(CASE WHEN dm.metric_name ILIKE '%reading%fluency%' THEN dm.target_value END) as reading_target,
    MAX(CASE WHEN dm.metric_name ILIKE '%math%fluency%' OR dm.metric_name ILIKE '%math%fact%' THEN dm.target_value END) as math_target
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 2. get_behavior_function_data: Fix to use measurement_date instead of created_at
DROP FUNCTION IF EXISTS get_behavior_function_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_behavior_function_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  behavior_type text,
  frequency bigint,
  avg_duration numeric,
  common_antecedent text,
  common_consequence text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.metric_name as behavior_type,
    COUNT(*) as frequency,
    AVG(dm.duration_minutes) as avg_duration,
    MODE() WITHIN GROUP (ORDER BY dm.context) as common_antecedent,
    MODE() WITHIN GROUP (ORDER BY dm.intervention_used) as common_consequence
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND (dm.metric_type = 'behavioral_incident' OR dm.metric_type = 'behavior_frequency')
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.metric_name
  HAVING COUNT(*) >= 2
  ORDER BY frequency DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 3. get_social_skills_data: Add date range support
DROP FUNCTION IF EXISTS get_social_skills_data(uuid, uuid);

CREATE OR REPLACE FUNCTION get_social_skills_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  skill_name text,
  success_rate numeric,
  total_attempts bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.metric_name as skill_name,
    CASE 
      WHEN SUM(dm.target_value) > 0 
      THEN ROUND((SUM(dm.metric_value) / SUM(dm.target_value)) * 100, 1)
      WHEN COUNT(*) > 0
      THEN ROUND(AVG(dm.metric_value), 1)
      ELSE 0
    END as success_rate,
    COUNT(*) as total_attempts
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type = 'social_skill'
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.metric_name
  HAVING COUNT(*) >= 3
  ORDER BY success_rate ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 4. get_transition_success_data: Use measurement_date
DROP FUNCTION IF EXISTS get_transition_success_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_transition_success_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  transition_type text,
  total_transitions bigint,
  successful_transitions bigint,
  success_rate numeric,
  avg_support_level numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(dm.context, dm.metric_name) as transition_type,
    COUNT(*) as total_transitions,
    COUNT(*) FILTER (WHERE dm.metric_value >= 7) as successful_transitions,
    ROUND((COUNT(*) FILTER (WHERE dm.metric_value >= 7)::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC) * 100, 1) as success_rate,
    AVG(CASE 
      WHEN dm.intervention_used ILIKE '%independent%' THEN 1
      WHEN dm.intervention_used ILIKE '%verbal%' THEN 2
      WHEN dm.intervention_used ILIKE '%visual%' THEN 3
      WHEN dm.intervention_used ILIKE '%physical%' THEN 4
      ELSE 2
    END) as avg_support_level
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type = 'transition'
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY COALESCE(dm.context, dm.metric_name)
  ORDER BY success_rate ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 5. get_environmental_impact_data: Use measurement_date
DROP FUNCTION IF EXISTS get_environmental_impact_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_environmental_impact_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  factor_category text,
  positive_correlation numeric,
  negative_correlation numeric,
  sample_size bigint
) AS $$
BEGIN
  RETURN QUERY
  WITH behavior_scores AS (
    SELECT 
      dm.measurement_date,
      AVG(CASE WHEN dm.metric_value >= 7 THEN 1 ELSE 0 END) as daily_success_rate
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND (
        p_days IS NULL OR
        dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
    GROUP BY dm.measurement_date
  ),
  weather_impact AS (
    SELECT 
      'Weather Conditions' as factor_category,
      CORR(
        CASE WHEN il.weather_condition IN ('Clear', 'Sunny') THEN 1 ELSE 0 END::NUMERIC,
        bs.daily_success_rate
      ) as positive_correlation,
      CORR(
        CASE WHEN il.weather_condition IN ('Rain', 'Storm', 'Overcast') THEN 1 ELSE 0 END::NUMERIC,
        bs.daily_success_rate
      ) as negative_correlation,
      COUNT(*) as sample_size
    FROM incident_logs il
    JOIN behavior_scores bs ON il.incident_date = bs.measurement_date
    WHERE il.family_id = p_family_id
      AND il.student_id = p_student_id
      AND (
        p_days IS NULL OR
        il.incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
    GROUP BY factor_category
  ),
  air_quality_impact AS (
    SELECT 
      'Air Quality' as factor_category,
      CORR(
        CASE WHEN il.aqi_us < 50 THEN 1 ELSE 0 END::NUMERIC,
        bs.daily_success_rate
      ) as positive_correlation,
      CORR(
        CASE WHEN il.aqi_us > 100 THEN 1 ELSE 0 END::NUMERIC,
        bs.daily_success_rate
      ) as negative_correlation,
      COUNT(*) as sample_size
    FROM incident_logs il
    JOIN behavior_scores bs ON il.incident_date = bs.measurement_date
    WHERE il.family_id = p_family_id
      AND il.student_id = p_student_id
      AND il.aqi_us IS NOT NULL
      AND (
        p_days IS NULL OR
        il.incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
    GROUP BY factor_category
  )
  SELECT * FROM weather_impact
  UNION ALL
  SELECT * FROM air_quality_impact;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 6. get_task_initiation_data: Use measurement_date
DROP FUNCTION IF EXISTS get_task_initiation_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_task_initiation_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  measurement_date date,
  avg_latency_seconds numeric,
  task_complexity text,
  prompt_level text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date,
    AVG(dm.metric_value) as avg_latency_seconds,
    dm.context as task_complexity,
    dm.intervention_used as prompt_level
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type = 'task_initiation'
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.measurement_date, dm.context, dm.intervention_used
  ORDER BY dm.measurement_date;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 7. get_working_memory_data: Use measurement_date
DROP FUNCTION IF EXISTS get_working_memory_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_working_memory_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  measurement_date date,
  step_count text,
  success_rate numeric,
  trial_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date,
    CASE 
      WHEN dm.metric_name ILIKE '%1-step%' OR dm.metric_name ILIKE '%one step%' THEN '1-Step'
      WHEN dm.metric_name ILIKE '%2-step%' OR dm.metric_name ILIKE '%two step%' THEN '2-Step'
      WHEN dm.metric_name ILIKE '%3-step%' OR dm.metric_name ILIKE '%three step%' OR dm.metric_name ILIKE '%multi%' THEN '3+ Step'
      ELSE 'Other'
    END as step_count,
    AVG(dm.metric_value) as success_rate,
    COUNT(*) as trial_count
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type = 'working_memory'
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.measurement_date, step_count
  ORDER BY dm.measurement_date, step_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 8. get_reading_error_data: Use measurement_date
DROP FUNCTION IF EXISTS get_reading_error_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_reading_error_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  error_type text,
  frequency bigint,
  percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH total_errors AS (
    SELECT COUNT(*) as total
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type = 'reading_error'
      AND (
        p_days IS NULL OR
        dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      )
  )
  SELECT 
    COALESCE(dm.context, dm.metric_name) as error_type,
    COUNT(*) as frequency,
    ROUND((COUNT(*)::NUMERIC / NULLIF((SELECT total FROM total_errors), 0)) * 100, 1) as percentage
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type = 'reading_error'
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY COALESCE(dm.context, dm.metric_name)
  ORDER BY frequency DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 9. get_fine_motor_data: Use measurement_date
DROP FUNCTION IF EXISTS get_fine_motor_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_fine_motor_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  skill_name text,
  current_level numeric,
  target_level numeric,
  mastery_percentage numeric,
  measurement_date date
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.metric_name as skill_name,
    dm.metric_value as current_level,
    dm.target_value as target_level,
    CASE 
      WHEN dm.target_value > 0 THEN ROUND((dm.metric_value / dm.target_value) * 100, 1)
      ELSE dm.metric_value
    END as mastery_percentage,
    dm.measurement_date
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type = 'fine_motor'
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  ORDER BY dm.measurement_date DESC, dm.metric_name;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 10. get_gross_motor_data: Use measurement_date
DROP FUNCTION IF EXISTS get_gross_motor_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_gross_motor_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  skill_name text,
  success_rate numeric,
  trial_count bigint,
  complexity_level text,
  measurement_date date
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.metric_name as skill_name,
    AVG(dm.metric_value) as success_rate,
    COUNT(*) as trial_count,
    COALESCE(dm.context, 'Standard') as complexity_level,
    dm.measurement_date
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type = 'gross_motor'
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.metric_name, dm.context, dm.measurement_date
  ORDER BY dm.measurement_date DESC, dm.metric_name;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 11. get_dls_trends_data: Use measurement_date
DROP FUNCTION IF EXISTS get_dls_trends_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_dls_trends_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  log_date date,
  teeth_brushing numeric,
  dressing numeric,
  toileting numeric,
  hand_washing numeric,
  meal_prep numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date as log_date,
    MAX(CASE WHEN dm.metric_name ILIKE '%teeth%' OR dm.metric_name ILIKE '%brush%' THEN dm.metric_value END) as teeth_brushing,
    MAX(CASE WHEN dm.metric_name ILIKE '%dress%' OR dm.metric_name ILIKE '%cloth%' THEN dm.metric_value END) as dressing,
    MAX(CASE WHEN dm.metric_name ILIKE '%toilet%' OR dm.metric_name ILIKE '%bathroom%' THEN dm.metric_value END) as toileting,
    MAX(CASE WHEN dm.metric_name ILIKE '%wash%hand%' OR dm.metric_name ILIKE '%hand%wash%' THEN dm.metric_value END) as hand_washing,
    MAX(CASE WHEN dm.metric_name ILIKE '%meal%' OR dm.metric_name ILIKE '%food prep%' THEN dm.metric_value END) as meal_prep
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type IN ('daily_living', 'adaptive_skill', 'self_care')
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.measurement_date
  ORDER BY dm.measurement_date;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 12. get_communication_progress_data: Use measurement_date
DROP FUNCTION IF EXISTS get_communication_progress_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_communication_progress_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  measurement_date date,
  expressive_language numeric,
  receptive_language numeric,
  pragmatic_skills numeric,
  articulation numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date,
    MAX(CASE WHEN dm.metric_name ILIKE '%expressive%' OR dm.metric_name ILIKE '%speaking%' THEN dm.metric_value END) as expressive_language,
    MAX(CASE WHEN dm.metric_name ILIKE '%receptive%' OR dm.metric_name ILIKE '%understanding%' THEN dm.metric_value END) as receptive_language,
    MAX(CASE WHEN dm.metric_name ILIKE '%pragmatic%' OR dm.metric_name ILIKE '%social communication%' THEN dm.metric_value END) as pragmatic_skills,
    MAX(CASE WHEN dm.metric_name ILIKE '%articulation%' OR dm.metric_name ILIKE '%pronunciation%' THEN dm.metric_value END) as articulation
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type IN ('communication', 'language', 'speech')
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.measurement_date
  HAVING MAX(CASE WHEN dm.metric_name ILIKE '%expressive%' OR dm.metric_name ILIKE '%receptive%' OR dm.metric_name ILIKE '%pragmatic%' OR dm.metric_name ILIKE '%articulation%' THEN 1 END) = 1
  ORDER BY dm.measurement_date;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 13. get_attention_span_data: Use measurement_date
DROP FUNCTION IF EXISTS get_attention_span_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_attention_span_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  log_date date,
  avg_attention_minutes numeric,
  task_type text,
  distraction_count bigint,
  redirection_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date as log_date,
    AVG(dm.metric_value) as avg_attention_minutes,
    COALESCE(dm.context, 'General') as task_type,
    COUNT(*) FILTER (WHERE dm.intervention_used ILIKE '%distraction%') as distraction_count,
    COUNT(*) FILTER (WHERE dm.intervention_used ILIKE '%redirect%') as redirection_count
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type = 'attention_span'
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.measurement_date, dm.context
  ORDER BY dm.measurement_date;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 14. get_self_regulation_data: Use measurement_date
DROP FUNCTION IF EXISTS get_self_regulation_data(uuid, uuid, integer);

CREATE OR REPLACE FUNCTION get_self_regulation_data(
  p_family_id uuid,
  p_student_id uuid,
  p_days integer DEFAULT NULL
)
RETURNS TABLE(
  measurement_date date,
  emotional_regulation numeric,
  impulse_control numeric,
  self_calming numeric,
  frustration_tolerance numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.measurement_date,
    MAX(CASE WHEN dm.metric_name ILIKE '%emotion%' THEN dm.metric_value END) as emotional_regulation,
    MAX(CASE WHEN dm.metric_name ILIKE '%impulse%' THEN dm.metric_value END) as impulse_control,
    MAX(CASE WHEN dm.metric_name ILIKE '%calm%' OR dm.metric_name ILIKE '%sooth%' THEN dm.metric_value END) as self_calming,
    MAX(CASE WHEN dm.metric_name ILIKE '%frustration%' THEN dm.metric_value END) as frustration_tolerance
  FROM document_metrics dm
  WHERE dm.family_id = p_family_id
    AND dm.student_id = p_student_id
    AND dm.metric_type IN ('self_regulation', 'emotional_regulation')
    AND (
      p_days IS NULL OR
      dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    )
  GROUP BY dm.measurement_date
  ORDER BY dm.measurement_date;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;
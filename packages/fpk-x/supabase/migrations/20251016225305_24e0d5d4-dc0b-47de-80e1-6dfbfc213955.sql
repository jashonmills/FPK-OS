-- Phase 3: RPC Functions for Tier 3-5 Charts (Type-Fixed)

-- ==================== TIER 3 RPC FUNCTIONS ====================

CREATE OR REPLACE FUNCTION public.get_communication_progress_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 60
)
RETURNS TABLE(
  measurement_date DATE,
  expressive_language NUMERIC,
  receptive_language NUMERIC,
  pragmatic_skills NUMERIC,
  articulation NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    measurement_date,
    MAX(CASE WHEN metric_name ILIKE '%expressive%' OR metric_name ILIKE '%speaking%' THEN metric_value END) as expressive_language,
    MAX(CASE WHEN metric_name ILIKE '%receptive%' OR metric_name ILIKE '%understanding%' THEN metric_value END) as receptive_language,
    MAX(CASE WHEN metric_name ILIKE '%pragmatic%' OR metric_name ILIKE '%social communication%' THEN metric_value END) as pragmatic_skills,
    MAX(CASE WHEN metric_name ILIKE '%articulation%' OR metric_name ILIKE '%pronunciation%' THEN metric_value END) as articulation
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type IN ('communication', 'language', 'speech')
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY measurement_date
  HAVING MAX(CASE WHEN metric_name ILIKE '%expressive%' OR metric_name ILIKE '%receptive%' OR metric_name ILIKE '%pragmatic%' OR metric_name ILIKE '%articulation%' THEN 1 END) = 1
  ORDER BY measurement_date;
$$;

CREATE OR REPLACE FUNCTION public.get_attention_span_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  log_date DATE,
  avg_attention_minutes NUMERIC,
  task_type TEXT,
  distraction_count BIGINT,
  redirection_count BIGINT
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    measurement_date as log_date,
    AVG(metric_value) as avg_attention_minutes,
    COALESCE(context, 'General') as task_type,
    COUNT(*) FILTER (WHERE intervention_used ILIKE '%distraction%') as distraction_count,
    COUNT(*) FILTER (WHERE intervention_used ILIKE '%redirect%') as redirection_count
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'attention_span'
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY measurement_date, context
  ORDER BY measurement_date;
$$;

CREATE OR REPLACE FUNCTION public.get_self_regulation_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  measurement_date DATE,
  emotional_regulation NUMERIC,
  impulse_control NUMERIC,
  self_calming NUMERIC,
  frustration_tolerance NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    measurement_date,
    MAX(CASE WHEN metric_name ILIKE '%emotion%' THEN metric_value END) as emotional_regulation,
    MAX(CASE WHEN metric_name ILIKE '%impulse%' THEN metric_value END) as impulse_control,
    MAX(CASE WHEN metric_name ILIKE '%calm%' OR metric_name ILIKE '%sooth%' THEN metric_value END) as self_calming,
    MAX(CASE WHEN metric_name ILIKE '%frustration%' THEN metric_value END) as frustration_tolerance
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type IN ('self_regulation', 'emotional_regulation')
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY measurement_date
  ORDER BY measurement_date;
$$;

CREATE OR REPLACE FUNCTION public.get_peer_interaction_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  log_date DATE,
  positive_interactions BIGINT,
  negative_interactions BIGINT,
  initiated_interactions BIGINT,
  reciprocal_play NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    measurement_date as log_date,
    COUNT(*) FILTER (WHERE context ILIKE '%positive%' OR metric_value >= 7) as positive_interactions,
    COUNT(*) FILTER (WHERE context ILIKE '%negative%' OR metric_value < 4) as negative_interactions,
    COUNT(*) FILTER (WHERE context ILIKE '%initiat%') as initiated_interactions,
    AVG(metric_value) FILTER (WHERE metric_name ILIKE '%reciprocal%' OR metric_name ILIKE '%turn-taking%') as reciprocal_play
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type IN ('peer_interaction', 'social_skill')
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY measurement_date
  ORDER BY measurement_date;
$$;

-- ==================== TIER 4 RPC FUNCTIONS ====================

CREATE OR REPLACE FUNCTION public.get_executive_function_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  skill_area TEXT,
  current_score NUMERIC,
  trend TEXT,
  data_points BIGINT
) 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH ef_metrics AS (
    SELECT 
      CASE 
        WHEN metric_name ILIKE '%working memory%' THEN 'Working Memory'
        WHEN metric_name ILIKE '%planning%' OR metric_name ILIKE '%organization%' THEN 'Planning & Organization'
        WHEN metric_name ILIKE '%flexible%' OR metric_name ILIKE '%shift%' THEN 'Cognitive Flexibility'
        WHEN metric_name ILIKE '%inhibit%' OR metric_name ILIKE '%self-control%' THEN 'Inhibitory Control'
        WHEN metric_name ILIKE '%initiat%' THEN 'Task Initiation'
        ELSE 'Other EF Skills'
      END as skill_area,
      metric_value,
      measurement_date
    FROM document_metrics
    WHERE family_id = p_family_id
      AND student_id = p_student_id
      AND (metric_type = 'executive_function' OR metric_type = 'cognitive_skill')
      AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  ),
  recent_avg AS (
    SELECT 
      skill_area,
      AVG(metric_value) as avg_value
    FROM ef_metrics
    WHERE measurement_date >= CURRENT_DATE - ((p_days/2) || ' days')::INTERVAL
    GROUP BY skill_area
  ),
  older_avg AS (
    SELECT 
      skill_area,
      AVG(metric_value) as avg_value
    FROM ef_metrics
    WHERE measurement_date < CURRENT_DATE - ((p_days/2) || ' days')::INTERVAL
    GROUP BY skill_area
  )
  SELECT 
    ef.skill_area,
    AVG(ef.metric_value) as current_score,
    CASE 
      WHEN ra.avg_value > oa.avg_value THEN 'improving'::TEXT
      WHEN ra.avg_value < oa.avg_value THEN 'declining'::TEXT
      ELSE 'stable'::TEXT
    END as trend,
    COUNT(*)::BIGINT as data_points
  FROM ef_metrics ef
  LEFT JOIN recent_avg ra ON ef.skill_area = ra.skill_area
  LEFT JOIN older_avg oa ON ef.skill_area = oa.skill_area
  GROUP BY ef.skill_area, ra.avg_value, oa.avg_value
  ORDER BY current_score DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_sensory_integration_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  sensory_system TEXT,
  seeking_behaviors BIGINT,
  avoiding_behaviors BIGINT,
  regulation_score NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH sensory_data AS (
    SELECT 
      CASE 
        WHEN metric_name ILIKE '%visual%' OR metric_name ILIKE '%sight%' THEN 'Visual'
        WHEN metric_name ILIKE '%auditory%' OR metric_name ILIKE '%sound%' OR metric_name ILIKE '%hearing%' THEN 'Auditory'
        WHEN metric_name ILIKE '%tactile%' OR metric_name ILIKE '%touch%' THEN 'Tactile'
        WHEN metric_name ILIKE '%vestibular%' OR metric_name ILIKE '%balance%' OR metric_name ILIKE '%movement%' THEN 'Vestibular'
        WHEN metric_name ILIKE '%proprioceptive%' OR metric_name ILIKE '%body awareness%' THEN 'Proprioceptive'
        WHEN metric_name ILIKE '%oral%' OR metric_name ILIKE '%taste%' OR metric_name ILIKE '%smell%' THEN 'Oral/Gustatory'
        ELSE 'Other Sensory'
      END as sensory_system,
      metric_value,
      context
    FROM document_metrics
    WHERE family_id = p_family_id
      AND student_id = p_student_id
      AND metric_type IN ('sensory_profile', 'sensory_processing')
      AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  )
  SELECT 
    sensory_system,
    COUNT(*) FILTER (WHERE context ILIKE '%seek%' OR metric_value >= 8) as seeking_behaviors,
    COUNT(*) FILTER (WHERE context ILIKE '%avoid%' OR metric_value <= 3) as avoiding_behaviors,
    AVG(CASE 
      WHEN metric_value BETWEEN 4 AND 7 THEN 10
      WHEN metric_value > 7 THEN 10 - (metric_value - 7)
      ELSE metric_value
    END) as regulation_score
  FROM sensory_data
  GROUP BY sensory_system
  ORDER BY sensory_system;
$$;

CREATE OR REPLACE FUNCTION public.get_transition_success_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 60
)
RETURNS TABLE(
  transition_type TEXT,
  total_transitions BIGINT,
  successful_transitions BIGINT,
  success_rate NUMERIC,
  avg_support_level NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    COALESCE(context, metric_name) as transition_type,
    COUNT(*) as total_transitions,
    COUNT(*) FILTER (WHERE metric_value >= 7) as successful_transitions,
    ROUND((COUNT(*) FILTER (WHERE metric_value >= 7)::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC) * 100, 1) as success_rate,
    AVG(CASE 
      WHEN intervention_used ILIKE '%independent%' THEN 1
      WHEN intervention_used ILIKE '%verbal%' THEN 2
      WHEN intervention_used ILIKE '%visual%' THEN 3
      WHEN intervention_used ILIKE '%physical%' THEN 4
      ELSE 2
    END) as avg_support_level
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'transition'
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY COALESCE(context, metric_name)
  ORDER BY success_rate ASC;
$$;

-- ==================== TIER 5 RPC FUNCTIONS ====================

CREATE OR REPLACE FUNCTION public.get_environmental_impact_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  factor_category TEXT,
  positive_correlation NUMERIC,
  negative_correlation NUMERIC,
  sample_size BIGINT
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH behavior_scores AS (
    SELECT 
      measurement_date,
      AVG(CASE WHEN metric_value >= 7 THEN 1 ELSE 0 END) as daily_success_rate
    FROM document_metrics
    WHERE family_id = p_family_id
      AND student_id = p_student_id
      AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY measurement_date
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
      AND il.incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
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
      AND il.incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND il.aqi_us IS NOT NULL
    GROUP BY factor_category
  )
  SELECT * FROM weather_impact
  UNION ALL
  SELECT * FROM air_quality_impact;
$$;
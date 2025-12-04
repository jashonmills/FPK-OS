-- Phase 2: RPC Functions for Missing Tier 1 & 2 Charts (Fixed)

-- ==================== TIER 1 RPC FUNCTIONS ====================

-- Top Priority Goals Data
CREATE OR REPLACE FUNCTION public.get_top_priority_goals_data(
  p_family_id UUID,
  p_student_id UUID
)
RETURNS TABLE(
  goal_title TEXT,
  goal_type TEXT,
  current_value NUMERIC,
  target_value NUMERIC,
  progress_percentage NUMERIC,
  target_date DATE,
  is_active BOOLEAN
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    g.goal_title,
    g.goal_type,
    g.current_value,
    g.target_value,
    CASE 
      WHEN g.target_value > 0 THEN ROUND((g.current_value / g.target_value) * 100, 1)
      ELSE 0
    END as progress_percentage,
    g.target_date,
    g.is_active
  FROM goals g
  WHERE g.family_id = p_family_id
    AND g.student_id = p_student_id
    AND g.is_active = true
  ORDER BY 
    CASE 
      WHEN g.target_value > 0 THEN (g.current_value / g.target_value)
      ELSE 0
    END ASC
  LIMIT 5;
$$;

-- Strategy Success Rates Data
CREATE OR REPLACE FUNCTION public.get_strategy_success_rates_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  strategy_name TEXT,
  total_uses BIGINT,
  successful_uses BIGINT,
  success_rate NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    intervention_used as strategy_name,
    COUNT(*) as total_uses,
    COUNT(*) FILTER (WHERE severity IN ('mild', 'low')) as successful_uses,
    ROUND(
      (COUNT(*) FILTER (WHERE severity IN ('mild', 'low'))::NUMERIC / COUNT(*)::NUMERIC) * 100,
      1
    ) as success_rate
  FROM incident_logs
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    AND intervention_used IS NOT NULL
    AND intervention_used != ''
  GROUP BY intervention_used
  HAVING COUNT(*) >= 3
  ORDER BY success_rate DESC;
$$;

-- ==================== TIER 2 RPC FUNCTIONS ====================

-- Task Initiation & Latency Data
CREATE OR REPLACE FUNCTION public.get_task_initiation_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  measurement_date DATE,
  avg_latency_seconds NUMERIC,
  task_complexity TEXT,
  prompt_level TEXT
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    measurement_date,
    AVG(metric_value) as avg_latency_seconds,
    context as task_complexity,
    intervention_used as prompt_level
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'task_initiation'
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY measurement_date, context, intervention_used
  ORDER BY measurement_date;
$$;

-- Working Memory Success Data
CREATE OR REPLACE FUNCTION public.get_working_memory_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  measurement_date DATE,
  step_count TEXT,
  success_rate NUMERIC,
  trial_count BIGINT
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    measurement_date,
    CASE 
      WHEN metric_name ILIKE '%1-step%' OR metric_name ILIKE '%one step%' THEN '1-Step'
      WHEN metric_name ILIKE '%2-step%' OR metric_name ILIKE '%two step%' THEN '2-Step'
      WHEN metric_name ILIKE '%3-step%' OR metric_name ILIKE '%three step%' OR metric_name ILIKE '%multi%' THEN '3+ Step'
      ELSE 'Other'
    END as step_count,
    AVG(metric_value) as success_rate,
    COUNT(*) as trial_count
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'working_memory'
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY measurement_date, step_count
  ORDER BY measurement_date, step_count;
$$;

-- Reading Error Analysis Data
CREATE OR REPLACE FUNCTION public.get_reading_error_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 90
)
RETURNS TABLE(
  error_type TEXT,
  frequency BIGINT,
  percentage NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH total_errors AS (
    SELECT COUNT(*) as total
    FROM document_metrics
    WHERE family_id = p_family_id
      AND student_id = p_student_id
      AND metric_type = 'reading_error'
      AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  )
  SELECT 
    COALESCE(context, metric_name) as error_type,
    COUNT(*) as frequency,
    ROUND((COUNT(*)::NUMERIC / NULLIF((SELECT total FROM total_errors), 0)) * 100, 1) as percentage
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'reading_error'
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY COALESCE(context, metric_name)
  ORDER BY frequency DESC;
$$;

-- Fine Motor Skill Mastery Data
CREATE OR REPLACE FUNCTION public.get_fine_motor_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  skill_name TEXT,
  current_level NUMERIC,
  target_level NUMERIC,
  mastery_percentage NUMERIC,
  measurement_date DATE
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    metric_name as skill_name,
    metric_value as current_level,
    target_value as target_level,
    CASE 
      WHEN target_value > 0 THEN ROUND((metric_value / target_value) * 100, 1)
      ELSE metric_value
    END as mastery_percentage,
    measurement_date
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'fine_motor'
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  ORDER BY measurement_date DESC, metric_name;
$$;

-- Gross Motor Planning Data
CREATE OR REPLACE FUNCTION public.get_gross_motor_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  skill_name TEXT,
  success_rate NUMERIC,
  trial_count BIGINT,
  complexity_level TEXT,
  measurement_date DATE
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    metric_name as skill_name,
    AVG(metric_value) as success_rate,
    COUNT(*) as trial_count,
    COALESCE(context, 'Standard') as complexity_level,
    measurement_date
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'gross_motor'
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY metric_name, context, measurement_date
  ORDER BY measurement_date DESC, metric_name;
$$;

-- Daily Living Skills Trends Data
CREATE OR REPLACE FUNCTION public.get_dls_trends_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  log_date DATE,
  teeth_brushing NUMERIC,
  dressing NUMERIC,
  toileting NUMERIC,
  hand_washing NUMERIC,
  meal_prep NUMERIC
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    measurement_date as log_date,
    MAX(CASE WHEN metric_name ILIKE '%teeth%' OR metric_name ILIKE '%brush%' THEN metric_value END) as teeth_brushing,
    MAX(CASE WHEN metric_name ILIKE '%dress%' OR metric_name ILIKE '%cloth%' THEN metric_value END) as dressing,
    MAX(CASE WHEN metric_name ILIKE '%toilet%' OR metric_name ILIKE '%bathroom%' THEN metric_value END) as toileting,
    MAX(CASE WHEN metric_name ILIKE '%wash%hand%' OR metric_name ILIKE '%hand%wash%' THEN metric_value END) as hand_washing,
    MAX(CASE WHEN metric_name ILIKE '%meal%' OR metric_name ILIKE '%food prep%' THEN metric_value END) as meal_prep
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type IN ('daily_living', 'adaptive_skill', 'self_care')
    AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY measurement_date
  ORDER BY measurement_date;
$$;

-- Session Activity Breakdown Data (uses activities_completed array)
CREATE OR REPLACE FUNCTION public.get_session_activity_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  log_date DATE,
  academic_count INTEGER,
  movement_count INTEGER,
  sensory_count INTEGER,
  social_count INTEGER,
  session_duration INTEGER
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    log_date,
    (
      SELECT COUNT(*)
      FROM unnest(activities_completed) AS activity
      WHERE activity ILIKE '%academic%' OR activity ILIKE '%reading%' OR activity ILIKE '%math%' OR activity ILIKE '%writing%'
    )::INTEGER as academic_count,
    (
      SELECT COUNT(*)
      FROM unnest(activities_completed) AS activity
      WHERE activity ILIKE '%movement%' OR activity ILIKE '%physical%' OR activity ILIKE '%exercise%'
    )::INTEGER as movement_count,
    (
      SELECT COUNT(*)
      FROM unnest(activities_completed) AS activity
      WHERE activity ILIKE '%sensory%' OR activity ILIKE '%break%' OR activity ILIKE '%calm%'
    )::INTEGER as sensory_count,
    (
      SELECT COUNT(*)
      FROM unnest(activities_completed) AS activity
      WHERE activity ILIKE '%social%' OR activity ILIKE '%peer%' OR activity ILIKE '%group%'
    )::INTEGER as social_count,
    COALESCE(session_duration_minutes, 0) as session_duration
  FROM educator_logs
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  ORDER BY log_date;
$$;
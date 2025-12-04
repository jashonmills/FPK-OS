-- Phase 2 & 3: Project Nightingale - Intelligence Layer & Data Pipeline

-- ============================================================================
-- PHASE 2: INTELLIGENCE LAYER - Document to Chart Mapping
-- ============================================================================

-- Create the document_chart_mapping table
CREATE TABLE IF NOT EXISTS public.document_chart_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  chart_identifier TEXT NOT NULL,
  confidence_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, chart_identifier)
);

-- Enable RLS
ALTER TABLE public.document_chart_mapping ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Family members can manage their mappings
CREATE POLICY "Family members can view chart mappings"
ON public.document_chart_mapping
FOR SELECT
USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "System can insert chart mappings"
ON public.document_chart_mapping
FOR INSERT
WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can delete chart mappings"
ON public.document_chart_mapping
FOR DELETE
USING (is_family_member(auth.uid(), family_id));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_chart_mapping_family 
ON public.document_chart_mapping(family_id, chart_identifier);

-- ============================================================================
-- Chart Eligibility Function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_available_specialized_charts(p_family_id UUID)
RETURNS TABLE (
  chart_identifier TEXT, 
  document_count BIGINT,
  last_updated TIMESTAMPTZ
) 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    chart_identifier,
    COUNT(DISTINCT document_id) as document_count,
    MAX(created_at) as last_updated
  FROM document_chart_mapping
  WHERE family_id = p_family_id
  GROUP BY chart_identifier
  ORDER BY document_count DESC;
$$;

-- ============================================================================
-- PHASE 3: DATA PIPELINE - 7 Specialized Chart RPC Functions
-- ============================================================================

-- 1. Academic Fluency Trends
CREATE OR REPLACE FUNCTION public.get_academic_fluency_data(
  p_family_id UUID,
  p_student_id UUID,
  p_start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '30 days'),
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  measurement_date DATE,
  reading_fluency NUMERIC,
  math_fluency NUMERIC,
  reading_target NUMERIC,
  math_target NUMERIC
) 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    measurement_date,
    MAX(CASE WHEN metric_name ILIKE '%reading%fluency%' THEN metric_value END) as reading_fluency,
    MAX(CASE WHEN metric_name ILIKE '%math%fluency%' OR metric_name ILIKE '%math%fact%' THEN metric_value END) as math_fluency,
    MAX(CASE WHEN metric_name ILIKE '%reading%fluency%' THEN target_value END) as reading_target,
    MAX(CASE WHEN metric_name ILIKE '%math%fluency%' OR metric_name ILIKE '%math%fact%' THEN target_value END) as math_target
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND (metric_type = 'academic_fluency' OR metric_type = 'academic_performance')
    AND measurement_date BETWEEN p_start_date AND p_end_date
  GROUP BY measurement_date
  ORDER BY measurement_date;
$$;

-- 2. IEP Goal Service Tracker
CREATE OR REPLACE FUNCTION public.get_iep_goal_progress(
  p_family_id UUID,
  p_student_id UUID
)
RETURNS TABLE (
  goal_category TEXT,
  goal_count BIGINT,
  avg_progress NUMERIC,
  active_goals BIGINT
) 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(g.goal_type, pt.metric_type) as goal_category,
    COUNT(DISTINCT g.id) as goal_count,
    COALESCE(AVG(pt.progress_percentage), 0) as avg_progress,
    COUNT(DISTINCT g.id) FILTER (WHERE g.is_active = true) as active_goals
  FROM goals g
  FULL OUTER JOIN progress_tracking pt 
    ON pt.metric_type = g.goal_type 
    AND pt.family_id = g.family_id 
    AND pt.student_id = g.student_id
  WHERE (g.family_id = p_family_id OR pt.family_id = p_family_id)
    AND (g.student_id = p_student_id OR pt.student_id = p_student_id)
  GROUP BY COALESCE(g.goal_type, pt.metric_type)
  HAVING COUNT(DISTINCT g.id) > 0 OR AVG(pt.progress_percentage) IS NOT NULL
  ORDER BY avg_progress DESC;
$$;

-- 3. Behavior Function Analysis
CREATE OR REPLACE FUNCTION public.get_behavior_function_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  behavior_type TEXT,
  frequency BIGINT,
  avg_duration NUMERIC,
  common_antecedent TEXT,
  common_consequence TEXT
) 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    metric_name as behavior_type,
    COUNT(*) as frequency,
    AVG(duration_minutes) as avg_duration,
    MODE() WITHIN GROUP (ORDER BY context) as common_antecedent,
    MODE() WITHIN GROUP (ORDER BY intervention_used) as common_consequence
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND (metric_type = 'behavioral_incident' OR metric_type = 'behavior_frequency')
    AND created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL
  GROUP BY metric_name
  HAVING COUNT(*) >= 2
  ORDER BY frequency DESC;
$$;

-- 4. Sensory Profile Heatmap
CREATE OR REPLACE FUNCTION public.get_sensory_profile_data(
  p_family_id UUID,
  p_student_id UUID
)
RETURNS TABLE (
  sensory_category TEXT,
  intensity_level TEXT,
  frequency BIGINT,
  avg_value NUMERIC
) 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    metric_name as sensory_category,
    CASE 
      WHEN AVG(metric_value) >= 7 THEN 'High'
      WHEN AVG(metric_value) >= 4 THEN 'Moderate'
      ELSE 'Low'
    END as intensity_level,
    COUNT(*) as frequency,
    AVG(metric_value) as avg_value
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'sensory_profile'
  GROUP BY metric_name
  ORDER BY metric_name, avg_value DESC;
$$;

-- 5. Social Interaction Funnel
CREATE OR REPLACE FUNCTION public.get_social_skills_data(
  p_family_id UUID,
  p_student_id UUID
)
RETURNS TABLE (
  skill_name TEXT,
  success_rate NUMERIC,
  total_attempts BIGINT
) 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    metric_name as skill_name,
    CASE 
      WHEN SUM(target_value) > 0 
      THEN ROUND((SUM(metric_value) / SUM(target_value)) * 100, 1)
      WHEN COUNT(*) > 0
      THEN ROUND(AVG(metric_value), 1)
      ELSE 0
    END as success_rate,
    COUNT(*) as total_attempts
  FROM document_metrics
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND metric_type = 'social_skill'
  GROUP BY metric_name
  HAVING COUNT(*) >= 3
  ORDER BY success_rate ASC;
$$;

-- 6. Prompting Level Fading
CREATE OR REPLACE FUNCTION public.get_prompting_trend_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  log_date DATE,
  independent_count BIGINT,
  gestural_count BIGINT,
  verbal_count BIGINT,
  physical_count BIGINT,
  full_prompt_count BIGINT
) 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    log_date,
    SUM(CASE WHEN prompting_level = 'Independent' THEN 1 ELSE 0 END) as independent_count,
    SUM(CASE WHEN prompting_level = 'Gestural' THEN 1 ELSE 0 END) as gestural_count,
    SUM(CASE WHEN prompting_level = 'Verbal' THEN 1 ELSE 0 END) as verbal_count,
    SUM(CASE WHEN prompting_level = 'Physical' THEN 1 ELSE 0 END) as physical_count,
    SUM(CASE WHEN prompting_level = 'Full Prompt' THEN 1 ELSE 0 END) as full_prompt_count
  FROM educator_logs
  WHERE family_id = p_family_id
    AND student_id = p_student_id
    AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    AND prompting_level IS NOT NULL
  GROUP BY log_date
  ORDER BY log_date;
$$;

-- 7. Skill Mastery Progression
CREATE OR REPLACE FUNCTION public.get_skill_mastery_data(
  p_family_id UUID,
  p_student_id UUID
)
RETURNS TABLE (
  skill_domain TEXT,
  current_level NUMERIC,
  target_level NUMERIC,
  mastery_percentage NUMERIC,
  trend TEXT
) 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    metric_type as skill_domain,
    current_value as current_level,
    target_value as target_level,
    progress_percentage as mastery_percentage,
    trend
  FROM progress_tracking
  WHERE family_id = p_family_id
    AND student_id = p_student_id
  ORDER BY progress_percentage DESC;
$$;
-- Fix ambiguous column reference in get_executive_function_data
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
    ef_metrics.skill_area,
    AVG(ef_metrics.metric_value) as current_score,
    CASE 
      WHEN ra.avg_value > oa.avg_value THEN 'improving'::TEXT
      WHEN ra.avg_value < oa.avg_value THEN 'declining'::TEXT
      ELSE 'stable'::TEXT
    END as trend,
    COUNT(*)::BIGINT as data_points
  FROM ef_metrics
  LEFT JOIN recent_avg ra ON ef_metrics.skill_area = ra.skill_area
  LEFT JOIN older_avg oa ON ef_metrics.skill_area = oa.skill_area
  GROUP BY ef_metrics.skill_area, ra.avg_value, oa.avg_value
  ORDER BY current_score DESC;
END;
$$;
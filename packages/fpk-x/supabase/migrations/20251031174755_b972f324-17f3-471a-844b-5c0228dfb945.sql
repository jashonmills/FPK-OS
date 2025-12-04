-- Phase 2: Update RPC functions to UNION both document_metrics and manual log tables
-- This makes charts future-proof: they show document data now, and manual logs when added later

-- 1. Update get_daily_log_counts to include document_metrics
DROP FUNCTION IF EXISTS get_daily_log_counts(UUID, UUID, INTEGER);

CREATE OR REPLACE FUNCTION get_daily_log_counts(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  log_date DATE,
  incident_count BIGINT,
  parent_count BIGINT,
  educator_count BIGINT,
  total_count BIGINT
) AS $$
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
  incident_counts AS (
    SELECT il.incident_date AS log_date, COUNT(*) AS count
    FROM public.incident_logs il
    WHERE il.family_id = p_family_id AND il.student_id = p_student_id
      AND il.incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY il.incident_date
  ),
  -- Document-based incidents
  doc_incident_counts AS (
    SELECT dm.measurement_date::DATE AS log_date, COUNT(*) AS count
    FROM public.document_metrics dm
    WHERE dm.family_id = p_family_id AND dm.student_id = p_student_id
      AND dm.metric_type IN ('behavioral_incident', 'behavior_frequency')
      AND dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY dm.measurement_date::DATE
  ),
  -- Manual parent logs
  parent_counts AS (
    SELECT pl.log_date, COUNT(*) AS count
    FROM public.parent_logs pl
    WHERE pl.family_id = p_family_id AND pl.student_id = p_student_id
      AND pl.log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY pl.log_date
  ),
  -- Manual educator logs
  educator_counts AS (
    SELECT el.log_date, COUNT(*) AS count
    FROM public.educator_logs el
    WHERE el.family_id = p_family_id AND el.student_id = p_student_id
      AND el.log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY el.log_date
  )
  SELECT 
    ds.log_date,
    COALESCE(ic.count, 0) + COALESCE(dic.count, 0) AS incident_count,
    COALESCE(pc.count, 0) AS parent_count,
    COALESCE(ec.count, 0) AS educator_count,
    COALESCE(ic.count, 0) + COALESCE(dic.count, 0) + COALESCE(pc.count, 0) + COALESCE(ec.count, 0) AS total_count
  FROM date_series ds
  LEFT JOIN incident_counts ic ON ds.log_date = ic.log_date
  LEFT JOIN doc_incident_counts dic ON ds.log_date = dic.log_date
  LEFT JOIN parent_counts pc ON ds.log_date = pc.log_date
  LEFT JOIN educator_counts ec ON ds.log_date = ec.log_date
  ORDER BY ds.log_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update get_weekly_mood_counts to include document_metrics
DROP FUNCTION IF EXISTS get_weekly_mood_counts(UUID, UUID, INTEGER);

CREATE OR REPLACE FUNCTION get_weekly_mood_counts(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  day_of_week TEXT,
  day_order INTEGER,
  mood TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH mood_from_logs AS (
    -- Manual parent logs
    SELECT 
      TRIM(TO_CHAR(pl.log_date, 'Day')) AS day_of_week,
      CAST(TO_CHAR(pl.log_date, 'D') AS INTEGER) AS day_order,
      pl.mood,
      COUNT(*) AS count
    FROM public.parent_logs pl
    WHERE pl.family_id = p_family_id 
      AND pl.student_id = p_student_id
      AND pl.log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND pl.mood IS NOT NULL
    GROUP BY TRIM(TO_CHAR(pl.log_date, 'Day')), CAST(TO_CHAR(pl.log_date, 'D') AS INTEGER), pl.mood
  ),
  mood_from_docs AS (
    -- Document metrics for mood/emotional state
    SELECT 
      TRIM(TO_CHAR(dm.measurement_date, 'Day')) AS day_of_week,
      CAST(TO_CHAR(dm.measurement_date, 'D') AS INTEGER) AS day_order,
      dm.metric_name AS mood,
      COUNT(*) AS count
    FROM public.document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type IN ('mood_tracking', 'emotional_state', 'behavioral_observation')
      AND dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND dm.metric_name IS NOT NULL
    GROUP BY TRIM(TO_CHAR(dm.measurement_date, 'Day')), CAST(TO_CHAR(dm.measurement_date, 'D') AS INTEGER), dm.metric_name
  )
  SELECT * FROM mood_from_logs
  UNION ALL
  SELECT * FROM mood_from_docs
  ORDER BY day_order, mood;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. get_incident_frequency_data already updated, but let's enhance it
DROP FUNCTION IF EXISTS get_incident_frequency_data(UUID, UUID, INTEGER);

CREATE OR REPLACE FUNCTION get_incident_frequency_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT NULL
)
RETURNS TABLE (
  log_date DATE,
  incident_count INTEGER,
  severity_avg NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH manual_incidents AS (
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
    COALESCE(mi.log_date, di.log_date) as log_date,
    (COALESCE(mi.count, 0) + COALESCE(di.count, 0))::INTEGER as incident_count,
    COALESCE(
      (mi.avg_severity * mi.count + di.avg_severity * di.count) / NULLIF(mi.count + di.count, 0),
      mi.avg_severity,
      di.avg_severity
    ) as severity_avg
  FROM manual_incidents mi
  FULL OUTER JOIN doc_incidents di ON mi.log_date = di.log_date
  ORDER BY log_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update get_strategy_success_rates_data to include document metrics
DROP FUNCTION IF EXISTS get_strategy_success_rates_data(UUID, UUID, INTEGER);

CREATE OR REPLACE FUNCTION get_strategy_success_rates_data(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  strategy_name TEXT,
  total_uses BIGINT,
  successful_uses BIGINT,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH manual_strategies AS (
    SELECT 
      intervention_used as strategy_name,
      COUNT(*) as total_uses,
      COUNT(*) FILTER (WHERE severity IN ('mild', 'low')) as successful_uses
    FROM incident_logs
    WHERE family_id = p_family_id
      AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND intervention_used IS NOT NULL
      AND intervention_used != ''
    GROUP BY intervention_used
  ),
  doc_strategies AS (
    SELECT 
      intervention_used as strategy_name,
      COUNT(*) as total_uses,
      COUNT(*) FILTER (WHERE metric_value >= 7) as successful_uses
    FROM document_metrics
    WHERE family_id = p_family_id
      AND student_id = p_student_id
      AND measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND intervention_used IS NOT NULL
      AND intervention_used != ''
      AND metric_type IN ('intervention_effectiveness', 'behavior_frequency', 'behavioral_incident')
    GROUP BY intervention_used
  )
  SELECT 
    COALESCE(ms.strategy_name, ds.strategy_name) as strategy_name,
    (COALESCE(ms.total_uses, 0) + COALESCE(ds.total_uses, 0)) as total_uses,
    (COALESCE(ms.successful_uses, 0) + COALESCE(ds.successful_uses, 0)) as successful_uses,
    ROUND(
      ((COALESCE(ms.successful_uses, 0) + COALESCE(ds.successful_uses, 0))::NUMERIC / 
       NULLIF(COALESCE(ms.total_uses, 0) + COALESCE(ds.total_uses, 0), 0)::NUMERIC) * 100,
      1
    ) as success_rate
  FROM manual_strategies ms
  FULL OUTER JOIN doc_strategies ds ON ms.strategy_name = ds.strategy_name
  WHERE (COALESCE(ms.total_uses, 0) + COALESCE(ds.total_uses, 0)) >= 3
  ORDER BY success_rate DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update get_iep_goal_progress to include document metrics
DROP FUNCTION IF EXISTS get_iep_goal_progress(UUID, UUID, INTEGER);

CREATE OR REPLACE FUNCTION get_iep_goal_progress(
  p_family_id UUID,
  p_student_id UUID,
  p_days INTEGER DEFAULT NULL
)
RETURNS TABLE (
  goal_category TEXT,
  goal_count BIGINT,
  avg_progress NUMERIC,
  active_goals BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH goal_data AS (
    SELECT 
      g.goal_type,
      g.id,
      g.is_active,
      CASE 
        WHEN g.target_value > 0 THEN (g.current_value / g.target_value) * 100
        ELSE 0
      END as calculated_progress
    FROM goals g
    WHERE g.family_id = p_family_id
      AND g.student_id = p_student_id
      AND (p_days IS NULL OR g.created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL)
  ),
  progress_tracking_data AS (
    SELECT 
      pt.metric_type,
      pt.progress_percentage
    FROM progress_tracking pt
    WHERE pt.family_id = p_family_id
      AND pt.student_id = p_student_id
      AND (p_days IS NULL OR pt.period_start >= CURRENT_DATE - (p_days || ' days')::INTERVAL)
  ),
  doc_progress_data AS (
    SELECT 
      dm.metric_type,
      AVG(
        CASE 
          WHEN dm.target_value > 0 THEN (dm.metric_value / dm.target_value) * 100
          ELSE dm.metric_value
        END
      ) as avg_progress
    FROM document_metrics dm
    WHERE dm.family_id = p_family_id
      AND dm.student_id = p_student_id
      AND dm.metric_type IN ('goal_progress', 'academic_performance', 'behavioral_progress', 'service_delivery')
      AND (p_days IS NULL OR dm.measurement_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL)
    GROUP BY dm.metric_type
  )
  SELECT 
    COALESCE(gd.goal_type, ptd.metric_type, dpd.metric_type) as goal_category,
    COUNT(DISTINCT gd.id) as goal_count,
    COALESCE(
      AVG(dpd.avg_progress),
      AVG(ptd.progress_percentage),
      AVG(gd.calculated_progress),
      0
    ) as avg_progress,
    COUNT(DISTINCT gd.id) FILTER (WHERE gd.is_active = true) as active_goals
  FROM goal_data gd
  FULL OUTER JOIN progress_tracking_data ptd ON ptd.metric_type = gd.goal_type
  FULL OUTER JOIN doc_progress_data dpd ON dpd.metric_type = COALESCE(gd.goal_type, ptd.metric_type)
  GROUP BY COALESCE(gd.goal_type, ptd.metric_type, dpd.metric_type)
  HAVING COUNT(DISTINCT gd.id) > 0 OR AVG(ptd.progress_percentage) IS NOT NULL OR AVG(dpd.avg_progress) IS NOT NULL
  ORDER BY avg_progress DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
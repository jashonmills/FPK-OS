-- Create SQL functions for analytics

-- Global average score function
CREATE OR REPLACE FUNCTION get_global_avg_score()
RETURNS TABLE(avg_score NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT AVG(COALESCE(rt.score_raw, rt.score_scaled * 100.0)) as avg_score
  FROM scorm_runtime rt
  WHERE rt.score_raw IS NOT NULL OR rt.score_scaled IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Global completion rate function
CREATE OR REPLACE FUNCTION get_global_completion_rate()
RETURNS TABLE(completion_rate NUMERIC) AS $$
BEGIN
  RETURN QUERY
  WITH s AS (
    SELECT package_id, COUNT(*) as scos_total
    FROM scorm_scos 
    WHERE is_launchable = true 
    GROUP BY package_id
  ),
  r AS (
    SELECT e.id as enrollment_id, e.package_id,
           COUNT(DISTINCT rt.sco_id) FILTER (
             WHERE (rt.lesson_status IN ('completed','passed')
                    OR rt.completion_status = 'completed')
           ) as scos_completed
    FROM scorm_enrollments e
    LEFT JOIN scorm_runtime rt ON rt.enrollment_id = e.id
    GROUP BY e.id, e.package_id
  )
  SELECT (COUNT(*)::FLOAT / NULLIF((SELECT COUNT(*) FROM scorm_enrollments), 0)) * 100
  FROM r 
  JOIN s USING(package_id)
  WHERE r.scos_completed >= s.scos_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Package completion stats function
CREATE OR REPLACE FUNCTION get_package_completion_stats(
  package_id UUID,
  date_from TIMESTAMPTZ DEFAULT NULL,
  date_to TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(completions BIGINT, completion_rate NUMERIC) AS $$
BEGIN
  RETURN QUERY
  WITH package_enrollments AS (
    SELECT e.id, e.user_id, e.package_id
    FROM scorm_enrollments e
    WHERE e.package_id = get_package_completion_stats.package_id
  ),
  package_scos AS (
    SELECT COUNT(*) as scos_total
    FROM scorm_scos s
    WHERE s.package_id = get_package_completion_stats.package_id
      AND s.is_launchable = true
  ),
  completed_enrollments AS (
    SELECT e.id as enrollment_id
    FROM package_enrollments e
    JOIN scorm_runtime rt ON rt.enrollment_id = e.id
    WHERE (date_from IS NULL OR rt.last_commit_at >= date_from)
      AND (date_to IS NULL OR rt.last_commit_at <= date_to)
    GROUP BY e.id
    HAVING COUNT(DISTINCT rt.sco_id) FILTER (
      WHERE rt.lesson_status IN ('completed','passed')
         OR rt.completion_status = 'completed'
    ) >= (SELECT scos_total FROM package_scos)
  )
  SELECT 
    COUNT(*)::BIGINT as completions,
    (COUNT(*)::FLOAT / NULLIF((SELECT COUNT(*) FROM package_enrollments), 0)) * 100 as completion_rate
  FROM completed_enrollments;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Package average score function
CREATE OR REPLACE FUNCTION get_package_avg_score(
  package_id UUID,
  date_from TIMESTAMPTZ DEFAULT NULL,
  date_to TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(avg_score NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT AVG(COALESCE(rt.score_raw, rt.score_scaled * 100.0)) as avg_score
  FROM scorm_runtime rt
  JOIN scorm_enrollments e ON e.id = rt.enrollment_id
  WHERE e.package_id = get_package_avg_score.package_id
    AND (rt.score_raw IS NOT NULL OR rt.score_scaled IS NOT NULL)
    AND (date_from IS NULL OR rt.last_commit_at >= date_from)
    AND (date_to IS NULL OR rt.last_commit_at <= date_to);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Analytics trends function
CREATE OR REPLACE FUNCTION get_analytics_trends(
  package_id UUID DEFAULT NULL,
  date_from TIMESTAMPTZ DEFAULT NULL,
  date_to TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(
  date DATE,
  enrollments BIGINT,
  active_learners BIGINT,
  avg_score NUMERIC,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      COALESCE(date_from::DATE, CURRENT_DATE - INTERVAL '30 days'), 
      COALESCE(date_to::DATE, CURRENT_DATE),
      '1 day'::INTERVAL
    )::DATE as date
  ),
  daily_enrollments AS (
    SELECT e.created_at::DATE as date, COUNT(*) as enrollments
    FROM scorm_enrollments e
    WHERE (package_id IS NULL OR e.package_id = get_analytics_trends.package_id)
      AND (date_from IS NULL OR e.created_at >= date_from)
      AND (date_to IS NULL OR e.created_at <= date_to)
    GROUP BY e.created_at::DATE
  ),
  daily_active AS (
    SELECT rt.last_commit_at::DATE as date, COUNT(DISTINCT rt.enrollment_id) as active_learners
    FROM scorm_runtime rt
    JOIN scorm_enrollments e ON e.id = rt.enrollment_id
    WHERE (package_id IS NULL OR e.package_id = get_analytics_trends.package_id)
      AND (date_from IS NULL OR rt.last_commit_at >= date_from)
      AND (date_to IS NULL OR rt.last_commit_at <= date_to)
    GROUP BY rt.last_commit_at::DATE
  ),
  daily_scores AS (
    SELECT rt.last_commit_at::DATE as date, 
           AVG(COALESCE(rt.score_raw, rt.score_scaled * 100.0)) as avg_score
    FROM scorm_runtime rt
    JOIN scorm_enrollments e ON e.id = rt.enrollment_id
    WHERE (package_id IS NULL OR e.package_id = get_analytics_trends.package_id)
      AND (rt.score_raw IS NOT NULL OR rt.score_scaled IS NOT NULL)
      AND (date_from IS NULL OR rt.last_commit_at >= date_from)
      AND (date_to IS NULL OR rt.last_commit_at <= date_to)
    GROUP BY rt.last_commit_at::DATE
  )
  SELECT 
    ds.date,
    COALESCE(de.enrollments, 0) as enrollments,
    COALESCE(da.active_learners, 0) as active_learners,
    COALESCE(dsc.avg_score, 0) as avg_score,
    0::NUMERIC as completion_rate -- Simplified for now
  FROM date_series ds
  LEFT JOIN daily_enrollments de ON de.date = ds.date
  LEFT JOIN daily_active da ON da.date = ds.date
  LEFT JOIN daily_scores dsc ON dsc.date = ds.date
  ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
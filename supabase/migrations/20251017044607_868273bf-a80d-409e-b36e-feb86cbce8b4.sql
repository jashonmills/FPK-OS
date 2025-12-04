-- Fix ambiguous column references in get_daily_log_counts
DROP FUNCTION IF EXISTS get_daily_log_counts(uuid, uuid, integer);
CREATE OR REPLACE FUNCTION get_daily_log_counts(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT 30)
RETURNS TABLE(log_date date, incident_count bigint, parent_count bigint, educator_count bigint, total_count bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (p_days || ' days')::INTERVAL,
      CURRENT_DATE,
      '1 day'::INTERVAL
    )::DATE AS log_date
  ),
  incident_counts AS (
    SELECT incident_date AS log_date, COUNT(*) AS count
    FROM public.incident_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY incident_date
  ),
  parent_counts AS (
    SELECT log_date, COUNT(*) AS count
    FROM public.parent_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY log_date
  ),
  educator_counts AS (
    SELECT log_date, COUNT(*) AS count
    FROM public.educator_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND log_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY log_date
  )
  SELECT 
    ds.log_date,
    COALESCE(ic.count, 0) AS incident_count,
    COALESCE(pc.count, 0) AS parent_count,
    COALESCE(ec.count, 0) AS educator_count,
    COALESCE(ic.count, 0) + COALESCE(pc.count, 0) + COALESCE(ec.count, 0) AS total_count
  FROM date_series ds
  LEFT JOIN incident_counts ic ON ds.log_date = ic.log_date
  LEFT JOIN parent_counts pc ON ds.log_date = pc.log_date
  LEFT JOIN educator_counts ec ON ds.log_date = ec.log_date
  ORDER BY ds.log_date;
END;
$$;

-- Fix ambiguous column references in get_intervention_effectiveness_data
DROP FUNCTION IF EXISTS get_intervention_effectiveness_data(uuid, uuid, integer);
CREATE OR REPLACE FUNCTION get_intervention_effectiveness_data(p_family_id uuid, p_student_id uuid, p_days integer DEFAULT 30)
RETURNS TABLE(log_date date, incident_count bigint, intervention_count bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (p_days || ' days')::INTERVAL,
      CURRENT_DATE,
      '1 day'::INTERVAL
    )::DATE AS log_date
  ),
  daily_incidents AS (
    SELECT incident_date AS log_date, COUNT(*) AS count
    FROM public.incident_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    GROUP BY incident_date
  ),
  daily_interventions AS (
    SELECT incident_date AS log_date, COUNT(*) AS count
    FROM public.incident_logs
    WHERE family_id = p_family_id AND student_id = p_student_id
      AND incident_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
      AND intervention_used IS NOT NULL
    GROUP BY incident_date
  )
  SELECT 
    ds.log_date,
    COALESCE(di.count, 0) AS incident_count,
    COALESCE(dint.count, 0) AS intervention_count
  FROM date_series ds
  LEFT JOIN daily_incidents di ON ds.log_date = di.log_date
  LEFT JOIN daily_interventions dint ON ds.log_date = dint.log_date
  ORDER BY ds.log_date;
END;
$$;
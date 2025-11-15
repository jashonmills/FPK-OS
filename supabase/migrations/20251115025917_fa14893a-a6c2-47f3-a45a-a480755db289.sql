-- EMERGENCY HOTFIX: Fix get_activity_frequency RPC
-- Issue 1: Column ambiguity between RETURNS TABLE and actual table columns
-- Issue 2: Frontend expects 'count' but RPC returns 'log_count'

-- Drop the broken function
DROP FUNCTION IF EXISTS public.get_activity_frequency(UUID, DATE, DATE);

-- Create corrected version
CREATE OR REPLACE FUNCTION public.get_activity_frequency(
  p_client_id UUID,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  log_type TEXT,
  count BIGINT,
  log_date DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_start DATE;
  v_end DATE;
BEGIN
  -- Default to last 30 days if not specified
  v_start := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '30 days');
  v_end := COALESCE(p_end_date, CURRENT_DATE);
  
  RETURN QUERY
  SELECT 
    'incident'::TEXT as log_type, 
    COUNT(*)::BIGINT as count, 
    il.incident_date as log_date
  FROM incident_logs il
  WHERE il.client_id = p_client_id
    AND il.incident_date BETWEEN v_start AND v_end
  GROUP BY il.incident_date
  
  UNION ALL
  
  SELECT 
    'parent'::TEXT as log_type, 
    COUNT(*)::BIGINT as count, 
    pl.log_date
  FROM parent_logs pl
  WHERE pl.client_id = p_client_id
    AND pl.log_date BETWEEN v_start AND v_end
  GROUP BY pl.log_date
  
  UNION ALL
  
  SELECT 
    'educator'::TEXT as log_type, 
    COUNT(*)::BIGINT as count, 
    el.log_date
  FROM educator_logs el
  WHERE el.client_id = p_client_id
    AND el.log_date BETWEEN v_start AND v_end
  GROUP BY el.log_date
  
  UNION ALL
  
  SELECT 
    'sleep'::TEXT as log_type, 
    COUNT(*)::BIGINT as count, 
    sr.sleep_date as log_date
  FROM sleep_records sr
  WHERE sr.client_id = p_client_id
    AND sr.sleep_date BETWEEN v_start AND v_end
  GROUP BY sr.sleep_date
  
  ORDER BY log_date DESC;
END;
$$;
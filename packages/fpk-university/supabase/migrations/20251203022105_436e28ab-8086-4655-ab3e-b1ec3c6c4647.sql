-- Create function to get recent activity logs for Admin Co-pilot
CREATE OR REPLACE FUNCTION public.get_admin_copilot_activity(p_org_id uuid, p_limit integer DEFAULT 50)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_activity', (
      SELECT COUNT(*) 
      FROM activity_log 
      WHERE org_id = p_org_id
    ),
    'recent_activity', COALESCE((
      SELECT jsonb_agg(activity_data ORDER BY (activity_data->>'created_at') DESC)
      FROM (
        SELECT jsonb_build_object(
          'event', al.event,
          'created_at', al.created_at,
          'user_id', al.user_id,
          'student_name', COALESCE(p.full_name, p.email, 'Unknown User'),
          'metadata', al.metadata
        ) as activity_data
        FROM activity_log al
        LEFT JOIN profiles p ON p.id = al.user_id
        WHERE al.org_id = p_org_id
        ORDER BY al.created_at DESC
        LIMIT p_limit
      ) subq
    ), '[]'::jsonb),
    'activity_by_type', COALESCE((
      SELECT jsonb_agg(type_data)
      FROM (
        SELECT jsonb_build_object(
          'event', event,
          'count', COUNT(*)
        ) as type_data
        FROM activity_log
        WHERE org_id = p_org_id
          AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY event
        ORDER BY COUNT(*) DESC
      ) subq
    ), '[]'::jsonb),
    'activity_today', (
      SELECT COUNT(*)
      FROM activity_log
      WHERE org_id = p_org_id
        AND created_at >= CURRENT_DATE
    ),
    'activity_this_week', (
      SELECT COUNT(*)
      FROM activity_log
      WHERE org_id = p_org_id
        AND created_at >= NOW() - INTERVAL '7 days'
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$function$;
-- Fix get_org_student_activity_heatmap function to use correct column names
-- The interactive_course_sessions table uses session_start and session_end, not started_at and ended_at

CREATE OR REPLACE FUNCTION public.get_org_student_activity_heatmap(p_org_id uuid)
RETURNS TABLE(
  student_id uuid,
  student_name text,
  student_email text,
  avatar_url text,
  activity_status text,
  last_activity_at timestamptz,
  current_lesson_id text,
  progress_velocity numeric,
  engagement_score numeric,
  time_spent_today_minutes integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH student_members AS (
    SELECT 
      om.user_id,
      p.full_name,
      p.email,
      p.avatar_url as user_avatar
    FROM org_members om
    JOIN profiles p ON p.id = om.user_id
    WHERE om.org_id = p_org_id
      AND om.role = 'student'
      AND om.status = 'active'
  ),
  recent_activity AS (
    SELECT 
      al.user_id,
      MAX(al.created_at) as last_activity
    FROM activity_log al
    WHERE al.user_id IN (SELECT user_id FROM student_members)
      AND al.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY al.user_id
  ),
  today_activity AS (
    SELECT 
      ics.user_id,
      SUM(EXTRACT(EPOCH FROM (COALESCE(ics.session_end, NOW()) - ics.session_start)) / 60)::integer as minutes_today
    FROM interactive_course_sessions ics
    WHERE ics.user_id IN (SELECT user_id FROM student_members)
      AND ics.session_start >= CURRENT_DATE
    GROUP BY ics.user_id
  ),
  enrollment_progress AS (
    SELECT 
      ice.user_id,
      AVG(ice.completion_percentage) as avg_progress,
      MAX(ice.last_accessed_at) as last_course_access
    FROM interactive_course_enrollments ice
    WHERE ice.user_id IN (SELECT user_id FROM student_members)
    GROUP BY ice.user_id
  )
  SELECT 
    sm.user_id as student_id,
    sm.full_name as student_name,
    sm.email as student_email,
    sm.user_avatar as avatar_url,
    CASE 
      WHEN ra.last_activity >= NOW() - INTERVAL '1 day' THEN 'active'
      WHEN ra.last_activity >= NOW() - INTERVAL '3 days' THEN 'caution'
      ELSE 'struggling'
    END as activity_status,
    COALESCE(ra.last_activity, ep.last_course_access) as last_activity_at,
    NULL::text as current_lesson_id,
    COALESCE(ep.avg_progress, 0)::numeric as progress_velocity,
    CASE 
      WHEN ra.last_activity >= NOW() - INTERVAL '1 day' THEN 100
      WHEN ra.last_activity >= NOW() - INTERVAL '3 days' THEN 60
      WHEN ra.last_activity >= NOW() - INTERVAL '7 days' THEN 30
      ELSE 0
    END::numeric as engagement_score,
    COALESCE(ta.minutes_today, 0) as time_spent_today_minutes
  FROM student_members sm
  LEFT JOIN recent_activity ra ON ra.user_id = sm.user_id
  LEFT JOIN today_activity ta ON ta.user_id = sm.user_id
  LEFT JOIN enrollment_progress ep ON ep.user_id = sm.user_id
  ORDER BY 
    CASE 
      WHEN ra.last_activity >= NOW() - INTERVAL '1 day' THEN 1
      WHEN ra.last_activity >= NOW() - INTERVAL '3 days' THEN 2
      ELSE 3
    END,
    sm.full_name;
END;
$$;
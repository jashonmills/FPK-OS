-- Update get_org_student_activity_heatmap to properly fetch student names from org_students
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
      -- Priority: org_students.full_name → profiles.full_name (if not empty) → email prefix → 'Unnamed Student'
      COALESCE(
        NULLIF(os.full_name, ''),
        NULLIF(p.full_name, ''),
        SPLIT_PART(COALESCE(au.email::text, os.student_email, ''), '@', 1),
        'Unnamed Student'
      ) as name,
      COALESCE(au.email::text, os.student_email, 'No email') as email,
      COALESCE(os.avatar_url, p.avatar_url) as avatar
    FROM org_members om
    LEFT JOIN profiles p ON p.id = om.user_id
    LEFT JOIN auth.users au ON au.id = om.user_id
    LEFT JOIN org_students os ON os.linked_user_id = om.user_id AND os.org_id = p_org_id
    WHERE om.org_id = p_org_id 
      AND om.role = 'student' 
      AND om.status = 'active'
  ),
  recent_activity AS (
    SELECT 
      ice.user_id,
      MAX(ice.last_accessed_at) as last_activity,
      SUM(ice.total_time_spent_minutes) as total_time,
      AVG(ice.completion_percentage) as avg_progress
    FROM interactive_course_enrollments ice
    WHERE ice.user_id IN (SELECT user_id FROM student_members)
      AND ice.last_accessed_at >= NOW() - INTERVAL '30 days'
    GROUP BY ice.user_id
  ),
  today_activity AS (
    SELECT 
      ics.user_id,
      SUM(EXTRACT(EPOCH FROM (COALESCE(ics.ended_at, NOW()) - ics.started_at)) / 60)::integer as minutes_today
    FROM interactive_course_sessions ics
    WHERE ics.user_id IN (SELECT user_id FROM student_members)
      AND ics.started_at >= CURRENT_DATE
    GROUP BY ics.user_id
  )
  SELECT 
    sm.user_id as student_id,
    sm.name as student_name,
    sm.email as student_email,
    sm.avatar as avatar_url,
    CASE 
      WHEN ra.last_activity >= NOW() - INTERVAL '24 hours' THEN 'active'
      WHEN ra.last_activity >= NOW() - INTERVAL '7 days' THEN 'caution'
      ELSE 'struggling'
    END as activity_status,
    ra.last_activity as last_activity_at,
    NULL::text as current_lesson_id,
    COALESCE(ra.avg_progress, 0) as progress_velocity,
    CASE 
      WHEN ra.total_time > 60 THEN 100
      WHEN ra.total_time > 30 THEN 75
      WHEN ra.total_time > 10 THEN 50
      ELSE 25
    END as engagement_score,
    COALESCE(ta.minutes_today, 0)::integer as time_spent_today_minutes
  FROM student_members sm
  LEFT JOIN recent_activity ra ON ra.user_id = sm.user_id
  LEFT JOIN today_activity ta ON ta.user_id = sm.user_id
  ORDER BY ra.last_activity DESC NULLS LAST;
END;
$$;
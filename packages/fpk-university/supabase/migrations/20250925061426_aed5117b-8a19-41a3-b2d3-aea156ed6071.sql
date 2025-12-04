-- Create function to get organization student activity heatmap
CREATE OR REPLACE FUNCTION public.get_org_student_activity_heatmap(p_org_id uuid)
RETURNS TABLE(
  student_id uuid,
  student_name text,
  student_email text,
  avatar_url text,
  activity_status text,
  last_activity_at timestamp with time zone,
  current_lesson_id text,
  progress_velocity numeric,
  engagement_score numeric,
  time_spent_today_minutes integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_time timestamptz := now();
BEGIN
  RETURN QUERY
  WITH student_members AS (
    -- Get all students in the organization
    SELECT 
      om.user_id,
      p.full_name as name,
      p.email,
      p.avatar_url
    FROM org_members om
    LEFT JOIN profiles p ON p.id = om.user_id
    WHERE om.org_id = p_org_id 
      AND om.role = 'student' 
      AND om.status = 'active'
  ),
  recent_activity AS (
    -- Get recent learning activity for each student
    SELECT 
      sm.user_id,
      MAX(COALESCE(ss.created_at, rs.session_start, cs.updated_at)) as last_active,
      COUNT(CASE WHEN ss.created_at >= current_time - interval '1 day' THEN 1 END) as sessions_today,
      SUM(CASE WHEN ss.created_at >= current_time - interval '1 day' 
               THEN COALESCE(ss.session_duration_seconds, 0) / 60 
               ELSE 0 END) as minutes_today,
      AVG(CASE WHEN ss.created_at >= current_time - interval '7 days' 
               THEN COALESCE(ss.session_duration_seconds, 0) / 60 
               ELSE 0 END) as avg_session_length
    FROM student_members sm
    LEFT JOIN study_sessions ss ON ss.user_id = sm.user_id
    LEFT JOIN reading_sessions rs ON rs.user_id = sm.user_id  
    LEFT JOIN chat_sessions cs ON cs.user_id = sm.user_id
    GROUP BY sm.user_id
  ),
  progress_data AS (
    -- Get current course progress and velocity
    SELECT 
      sm.user_id,
      AVG(e.progress_percentage) as avg_progress,
      COUNT(CASE WHEN e.updated_at >= current_time - interval '7 days' THEN 1 END) as recent_progress_updates,
      STRING_AGG(DISTINCT e.course_id, ', ') as current_courses
    FROM student_members sm
    LEFT JOIN enrollments e ON e.user_id = sm.user_id AND e.status = 'active'
    GROUP BY sm.user_id
  )
  SELECT 
    sm.user_id as student_id,
    COALESCE(sm.name, 'Unnamed Student') as student_name,
    COALESCE(sm.email, 'No email') as student_email,
    sm.avatar_url,
    -- Determine activity status based on recent activity
    CASE 
      WHEN ra.last_active >= current_time - interval '15 minutes' 
           AND COALESCE(ra.sessions_today, 0) > 0 THEN 'active'
      WHEN ra.last_active >= current_time - interval '1 hour' 
           AND COALESCE(ra.sessions_today, 0) > 0 
           AND COALESCE(pd.recent_progress_updates, 0) < 2 THEN 'caution'
      WHEN ra.last_active >= current_time - interval '2 hours' THEN 'caution'
      ELSE 'struggling'
    END as activity_status,
    ra.last_active as last_activity_at,
    pd.current_courses as current_lesson_id,
    COALESCE(pd.recent_progress_updates, 0)::numeric as progress_velocity,
    -- Calculate engagement score (0-100)
    LEAST(100, GREATEST(0, 
      COALESCE(ra.sessions_today * 20, 0) + 
      COALESCE(ra.minutes_today * 2, 0) + 
      COALESCE(pd.recent_progress_updates * 15, 0)
    ))::numeric as engagement_score,
    COALESCE(ra.minutes_today, 0)::integer as time_spent_today_minutes
  FROM student_members sm
  LEFT JOIN recent_activity ra ON ra.user_id = sm.user_id
  LEFT JOIN progress_data pd ON pd.user_id = sm.user_id
  ORDER BY 
    CASE 
      WHEN ra.last_active >= current_time - interval '15 minutes' THEN 1
      WHEN ra.last_active >= current_time - interval '1 hour' THEN 2  
      WHEN ra.last_active >= current_time - interval '2 hours' THEN 3
      ELSE 4
    END,
    ra.last_active DESC NULLS LAST;
END;
$function$;
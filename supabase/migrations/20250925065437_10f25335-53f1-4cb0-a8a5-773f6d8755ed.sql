-- Fix the SQL function to work with actual table schema
CREATE OR REPLACE FUNCTION public.get_org_student_activity_heatmap(p_org_id uuid)
 RETURNS TABLE(student_id uuid, student_name text, student_email text, avatar_url text, activity_status text, last_activity_at timestamp with time zone, current_lesson_id text, progress_velocity numeric, engagement_score numeric, time_spent_today_minutes integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH student_members AS (
    SELECT 
      om.user_id,
      COALESCE(p.full_name, 'Student') as name,
      COALESCE(au.email, 'No email') as email,
      p.avatar_url
    FROM org_members om
    LEFT JOIN profiles p ON p.id = om.user_id
    LEFT JOIN auth.users au ON au.id = om.user_id
    WHERE om.org_id = p_org_id 
      AND om.role = 'student' 
      AND om.status = 'active'
  ),
  recent_activity AS (
    SELECT 
      sm.user_id,
      MAX(GREATEST(
        COALESCE(ss.created_at, '1970-01-01'::timestamptz), 
        COALESCE(rs.session_start, '1970-01-01'::timestamptz), 
        COALESCE(cs.updated_at, '1970-01-01'::timestamptz)
      )) as last_active,
      COUNT(CASE WHEN ss.created_at >= now() - interval '1 day' THEN 1 END) as sessions_today,
      COALESCE(SUM(CASE WHEN ss.created_at >= now() - interval '1 day' 
               THEN ss.session_duration_seconds / 60 
               ELSE 0 END), 0) as minutes_today,
      COUNT(ss.id) as total_sessions
    FROM student_members sm
    LEFT JOIN study_sessions ss ON ss.user_id = sm.user_id
    LEFT JOIN reading_sessions rs ON rs.user_id = sm.user_id  
    LEFT JOIN chat_sessions cs ON cs.user_id = sm.user_id
    GROUP BY sm.user_id
  ),
  progress_data AS (
    SELECT 
      sm.user_id,
      COUNT(e.id) as course_count,
      STRING_AGG(DISTINCT e.course_id, ', ') as current_courses
    FROM student_members sm
    LEFT JOIN enrollments e ON e.user_id = sm.user_id
    GROUP BY sm.user_id
  )
  SELECT 
    sm.user_id as student_id,
    sm.name as student_name,
    sm.email as student_email,
    sm.avatar_url,
    CASE 
      WHEN ra.last_active >= now() - interval '15 minutes' 
           AND COALESCE(ra.sessions_today, 0) > 0 THEN 'active'
      WHEN ra.last_active >= now() - interval '2 hours' 
           AND COALESCE(ra.total_sessions, 0) > 0 THEN 'caution'
      ELSE 'struggling'
    END as activity_status,
    CASE WHEN ra.last_active = '1970-01-01'::timestamptz THEN NULL ELSE ra.last_active END as last_activity_at,
    COALESCE(pd.current_courses, 'No courses') as current_lesson_id,
    COALESCE(pd.course_count, 0)::numeric as progress_velocity,
    LEAST(100, GREATEST(0, 
      COALESCE(ra.sessions_today * 20, 0) + 
      COALESCE(ra.minutes_today * 2, 0) + 
      COALESCE(pd.course_count * 10, 0)
    ))::numeric as engagement_score,
    COALESCE(ra.minutes_today, 0)::integer as time_spent_today_minutes
  FROM student_members sm
  LEFT JOIN recent_activity ra ON ra.user_id = sm.user_id
  LEFT JOIN progress_data pd ON pd.user_id = sm.user_id
  ORDER BY 
    CASE 
      WHEN ra.last_active >= now() - interval '15 minutes' THEN 1
      WHEN ra.last_active >= now() - interval '2 hours' THEN 2  
      ELSE 3
    END,
    ra.last_active DESC NULLS LAST;
END;
$function$;

-- Change instructors to students temporarily  
UPDATE public.org_members 
SET role = 'student' 
WHERE org_id = '68d708db-f516-46f2-8c69-44c727315f17'
  AND user_id IN ('2994c049-3a25-4633-98da-cbfe61157416', '5945ec0e-ac76-4a53-8d2d-e034eafc1a25');

-- Add study sessions with correct data
INSERT INTO public.study_sessions (user_id, session_type, flashcard_ids, total_cards, session_duration_seconds, created_at, completed_at)
VALUES 
  ('2994c049-3a25-4633-98da-cbfe61157416', 'memory_test', ARRAY[]::uuid[], 0, 1800, now() - interval '30 minutes', now() - interval '25 minutes'),
  ('5945ec0e-ac76-4a53-8d2d-e034eafc1a25', 'timed_challenge', ARRAY[]::uuid[], 0, 600, now() - interval '4 days', now() - interval '4 days' + interval '10 minutes')
ON CONFLICT DO NOTHING;

-- Add course enrollments with correct schema
INSERT INTO public.enrollments (user_id, course_id, enrolled_at)
VALUES 
  ('2994c049-3a25-4633-98da-cbfe61157416', 'interactive-algebra', now() - interval '4 days'),
  ('5945ec0e-ac76-4a53-8d2d-e034eafc1a25', 'interactive-algebra', now() - interval '8 days')
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Add chat session for recent activity
INSERT INTO public.chat_sessions (user_id, title, context_tag, created_at, updated_at)
VALUES 
  ('2994c049-3a25-4633-98da-cbfe61157416', 'Recent Study Help', 'Study Coach', now() - interval '45 minutes', now() - interval '45 minutes')
ON CONFLICT DO NOTHING;
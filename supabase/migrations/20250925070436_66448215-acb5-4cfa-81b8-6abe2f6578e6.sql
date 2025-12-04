-- Fix SQL function type mismatch and add demo students with correct session types
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
      COALESCE(p.full_name, 'Unnamed Student') as name,
      COALESCE(au.email::text, 'No email') as email, -- FIX: Cast varchar to text
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
      COUNT(e.id) as enrollment_count,
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
    COALESCE(pd.enrollment_count, 0)::numeric as progress_velocity,
    LEAST(100, GREATEST(0, 
      COALESCE(ra.sessions_today * 20, 0) + 
      COALESCE(ra.minutes_today * 2, 0) + 
      COALESCE(pd.enrollment_count * 10, 0)
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

-- Create demo student profiles using existing auth users
INSERT INTO public.profiles (id, full_name, display_name, created_at, updated_at)
VALUES 
  ('53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4', 'Emma Thompson', 'Emma', now() - interval '30 days', now()),
  ('74a8ee87-1ba5-4976-80c6-6e36880d38ca', 'Marcus Johnson', 'Marcus', now() - interval '30 days', now()),
  ('25c9fdfb-30ff-4402-9824-fd4104e1e1f3', 'Sophia Chen', 'Sophia', now() - interval '30 days', now()),
  ('a78af95c-c7f3-4f2b-842f-9da7446ef511', 'Liam Davis', 'Liam', now() - interval '30 days', now()),
  ('340c555f-80c6-49ba-982f-4dddcdf61b10', 'Ava Rodriguez', 'Ava', now() - interval '30 days', now())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  display_name = EXCLUDED.display_name,
  updated_at = now();

-- Add demo users as active students in the organization
INSERT INTO public.org_members (org_id, user_id, role, status)
VALUES 
  ('68d708db-f516-46f2-8c69-44c727315f17', '53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4', 'student', 'active'),
  ('68d708db-f516-46f2-8c69-44c727315f17', '74a8ee87-1ba5-4976-80c6-6e36880d38ca', 'student', 'active'),
  ('68d708db-f516-46f2-8c69-44c727315f17', '25c9fdfb-30ff-4402-9824-fd4104e1e1f3', 'student', 'active'),
  ('68d708db-f516-46f2-8c69-44c727315f17', 'a78af95c-c7f3-4f2b-842f-9da7446ef511', 'student', 'active'),
  ('68d708db-f516-46f2-8c69-44c727315f17', '340c555f-80c6-49ba-982f-4dddcdf61b10', 'student', 'active')
ON CONFLICT (org_id, user_id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- Add realistic activity data for demo students using valid session types

-- Emma Thompson (Active) - lots of recent activity  
INSERT INTO public.study_sessions (user_id, session_type, flashcard_ids, total_cards, session_duration_seconds, correct_answers, incorrect_answers, created_at, completed_at)
VALUES 
  ('53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4', 'memory_test', ARRAY[]::uuid[], 15, 1200, 12, 3, now() - interval '5 minutes', now() - interval '1 minute'),
  ('53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4', 'timed_challenge', ARRAY[]::uuid[], 20, 900, 18, 2, now() - interval '3 hours', now() - interval '2 hours 45 minutes'),
  ('53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4', 'multiple_choice', ARRAY[]::uuid[], 10, 600, 9, 1, now() - interval '1 day', now() - interval '1 day' + interval '10 minutes')
ON CONFLICT DO NOTHING;

-- Marcus Johnson (Active) - moderate activity
INSERT INTO public.study_sessions (user_id, session_type, flashcard_ids, total_cards, session_duration_seconds, correct_answers, incorrect_answers, created_at, completed_at)
VALUES 
  ('74a8ee87-1ba5-4976-80c6-6e36880d38ca', 'memory_test', ARRAY[]::uuid[], 12, 800, 10, 2, now() - interval '8 minutes', now() - interval '3 minutes'),
  ('74a8ee87-1ba5-4976-80c6-6e36880d38ca', 'multiple_choice', ARRAY[]::uuid[], 8, 500, 6, 2, now() - interval '6 hours', now() - interval '5 hours 52 minutes')
ON CONFLICT DO NOTHING;

-- Sophia Chen (Caution) - some activity but declining
INSERT INTO public.study_sessions (user_id, session_type, flashcard_ids, total_cards, session_duration_seconds, correct_answers, incorrect_answers, created_at, completed_at)
VALUES 
  ('25c9fdfb-30ff-4402-9824-fd4104e1e1f3', 'multiple_choice', ARRAY[]::uuid[], 6, 400, 4, 2, now() - interval '90 minutes', now() - interval '83 minutes'),
  ('25c9fdfb-30ff-4402-9824-fd4104e1e1f3', 'memory_test', ARRAY[]::uuid[], 10, 600, 7, 3, now() - interval '3 days', now() - interval '3 days' + interval '10 minutes')
ON CONFLICT DO NOTHING;

-- Liam Davis (Struggling) - minimal activity
INSERT INTO public.study_sessions (user_id, session_type, flashcard_ids, total_cards, session_duration_seconds, correct_answers, incorrect_answers, created_at, completed_at)
VALUES 
  ('a78af95c-c7f3-4f2b-842f-9da7446ef511', 'multiple_choice', ARRAY[]::uuid[], 5, 300, 2, 3, now() - interval '5 days', now() - interval '5 days' + interval '5 minutes')
ON CONFLICT DO NOTHING;

-- Ava Rodriguez (Struggling) - no recent activity (no sessions added intentionally)

-- Add course enrollments for demo students
INSERT INTO public.enrollments (user_id, course_id, enrolled_at)
VALUES 
  ('53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4', 'interactive-algebra', now() - interval '20 days'),
  ('53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4', 'interactive-science', now() - interval '15 days'),
  ('74a8ee87-1ba5-4976-80c6-6e36880d38ca', 'interactive-algebra', now() - interval '25 days'),
  ('74a8ee87-1ba5-4976-80c6-6e36880d38ca', 'geometry', now() - interval '18 days'), 
  ('25c9fdfb-30ff-4402-9824-fd4104e1e1f3', 'interactive-algebra', now() - interval '30 days'),
  ('a78af95c-c7f3-4f2b-842f-9da7446ef511', 'interactive-algebra', now() - interval '35 days'),
  ('340c555f-80c6-49ba-982f-4dddcdf61b10', 'interactive-algebra', now() - interval '40 days')
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Add chat sessions for engagement 
INSERT INTO public.chat_sessions (user_id, title, context_tag, created_at, updated_at)
VALUES 
  ('53e1ecc0-7194-4693-a53d-fcf4c3c4b4d4', 'Math Help Session', 'Study Coach', now() - interval '30 minutes', now() - interval '28 minutes'),
  ('74a8ee87-1ba5-4976-80c6-6e36880d38ca', 'Homework Questions', 'Study Coach', now() - interval '4 hours', now() - interval '3 hours 55 minutes'),
  ('25c9fdfb-30ff-4402-9824-fd4104e1e1f3', 'Study Tips', 'Study Coach', now() - interval '2 hours', now() - interval '1 hour 50 minutes')
ON CONFLICT DO NOTHING;
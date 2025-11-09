-- Enhanced get_student_knowledge_pack() function with real course data
-- This replaces the existing function to provide context-aware AI coaching

CREATE OR REPLACE FUNCTION public.get_student_knowledge_pack(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_result jsonb;
  v_active_courses jsonb;
  v_recent_lessons jsonb;
  v_learning_goals jsonb;
  v_instructor_notes jsonb;
  v_org_context jsonb;
  v_recent_progress jsonb;
  v_strengths_weaknesses jsonb;
  v_learning_patterns jsonb;
BEGIN
  -- 1. ACTIVE COURSES - Pull from interactive_course_enrollments
  SELECT jsonb_agg(
    jsonb_build_object(
      'course_id', ice.course_id,
      'course_title', c.title,
      'progress', ROUND(ice.completion_percentage, 0),
      'time_spent_minutes', ice.total_time_spent_minutes,
      'status', CASE 
        WHEN ice.completion_percentage >= 100 THEN 'completed'
        WHEN ice.completion_percentage > 0 THEN 'in_progress'
        ELSE 'not_started'
      END,
      'last_accessed', ice.last_accessed_at
    ) ORDER BY ice.last_accessed_at DESC NULLS LAST
  )
  INTO v_active_courses
  FROM interactive_course_enrollments ice
  JOIN courses c ON c.id = ice.course_id
  WHERE ice.user_id = p_user_id;

  -- 2. RECENT LESSON ACTIVITY (Last 7 days)
  SELECT jsonb_agg(
    jsonb_build_object(
      'lesson_title', lp.lesson_id,
      'course_id', lp.course_id,
      'time_spent_seconds', lp.time_spent_seconds,
      'completed_at', lp.completed_at
    ) ORDER BY lp.completed_at DESC
  )
  INTO v_recent_lessons
  FROM lesson_progress lp
  WHERE lp.user_id = p_user_id
    AND lp.completed_at >= NOW() - INTERVAL '7 days'
    AND lp.status = 'completed'
  LIMIT 10;

  -- 3. RECENT PROGRESS SUMMARY
  SELECT jsonb_build_object(
    'lessons_completed_last_7_days', COUNT(*),
    'study_time_last_7_days', ROUND(COALESCE(SUM(lp.time_spent_seconds) / 60.0, 0), 0)
  )
  INTO v_recent_progress
  FROM lesson_progress lp
  WHERE lp.user_id = p_user_id
    AND lp.completed_at >= NOW() - INTERVAL '7 days';

  -- 4. ACTIVE LEARNING GOALS
  SELECT jsonb_agg(
    jsonb_build_object(
      'title', g.title,
      'category', g.category,
      'progress', COALESCE(g.progress, 0),
      'target_date', g.target_date,
      'status', g.status
    ) ORDER BY g.created_at DESC
  )
  INTO v_learning_goals
  FROM goals g
  WHERE g.user_id = p_user_id
    AND g.status = 'active'
  LIMIT 5;

  -- 5. INSTRUCTOR NOTES (Critical context)
  SELECT jsonb_agg(
    jsonb_build_object(
      'note', sn.content,
      'category', COALESCE(sn.note_type, 'general'),
      'created_at', sn.created_at
    ) ORDER BY sn.created_at DESC
  )
  INTO v_instructor_notes
  FROM student_notes sn
  WHERE sn.user_id = p_user_id
    AND sn.note_type IN ('instructor', 'observation', 'concern', 'strength')
  LIMIT 5;

  -- 6. STRENGTHS & WEAKNESSES (based on lesson performance)
  WITH lesson_stats AS (
    SELECT 
      lp.course_id,
      c.title as course_title,
      AVG(CASE 
        WHEN lp.status = 'completed' AND lp.time_spent_seconds > 0 THEN 1.0
        ELSE 0.5
      END) as mastery_score
    FROM lesson_progress lp
    JOIN courses c ON c.id = lp.course_id
    WHERE lp.user_id = p_user_id
    GROUP BY lp.course_id, c.title
  )
  SELECT jsonb_build_object(
    'strengths', (
      SELECT jsonb_agg(course_title)
      FROM lesson_stats
      WHERE mastery_score >= 0.8
    ),
    'weaknesses', (
      SELECT jsonb_agg(course_title)
      FROM lesson_stats
      WHERE mastery_score < 0.5
    ),
    'average_mastery', (
      SELECT ROUND(AVG(mastery_score)::numeric, 2)
      FROM lesson_stats
    )
  )
  INTO v_strengths_weaknesses;

  -- 7. LEARNING PATTERNS
  WITH study_patterns AS (
    SELECT 
      COUNT(DISTINCT DATE(lp.completed_at)) as days_active,
      EXTRACT(HOUR FROM lp.completed_at) as hour_of_day,
      AVG(lp.time_spent_seconds) as avg_time
    FROM lesson_progress lp
    WHERE lp.user_id = p_user_id
      AND lp.completed_at >= NOW() - INTERVAL '30 days'
    GROUP BY EXTRACT(HOUR FROM lp.completed_at)
  )
  SELECT jsonb_build_object(
    'current_streak', COALESCE(
      (SELECT COUNT(DISTINCT DATE(lp.completed_at))
       FROM lesson_progress lp
       WHERE lp.user_id = p_user_id
         AND lp.completed_at >= CURRENT_DATE - INTERVAL '7 days'), 0
    ),
    'preferred_study_times', (
      SELECT jsonb_agg(hour_of_day ORDER BY COUNT(*) DESC)
      FROM study_patterns
      GROUP BY hour_of_day
      LIMIT 3
    ),
    'avg_session_length_minutes', (
      SELECT ROUND(AVG(avg_time) / 60.0, 0)
      FROM study_patterns
    )
  )
  INTO v_learning_patterns;

  -- 8. ORGANIZATION CONTEXT
  SELECT jsonb_build_object(
    'is_org_student', EXISTS(
      SELECT 1 FROM org_members om
      WHERE om.user_id = p_user_id
        AND om.status = 'active'
    ),
    'org_memberships', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'org_name', o.name,
          'role', om.role
        )
      )
      FROM org_members om
      JOIN organizations o ON o.id = om.org_id
      WHERE om.user_id = p_user_id
        AND om.status = 'active'
    ),
    'assigned_courses', (
      SELECT COUNT(*)
      FROM interactive_course_enrollments ice
      WHERE ice.user_id = p_user_id
    )
  )
  INTO v_org_context;

  -- Build final result
  v_result := jsonb_build_object(
    'user_id', p_user_id,
    'generated_at', NOW(),
    'active_courses', COALESCE(v_active_courses, '[]'::jsonb),
    'recent_activity', jsonb_build_object(
      'recent_lessons', COALESCE(v_recent_lessons, '[]'::jsonb),
      'study_time_last_7_days', COALESCE((v_recent_progress->>'study_time_last_7_days')::numeric, 0)
    ),
    'active_goals', COALESCE(v_learning_goals, '[]'::jsonb),
    'instructor_notes', COALESCE(v_instructor_notes, '[]'::jsonb),
    'strengths_weaknesses', COALESCE(v_strengths_weaknesses, '{}'::jsonb),
    'learning_patterns', COALESCE(v_learning_patterns, '{}'::jsonb),
    'organization_context', COALESCE(v_org_context, '{}'::jsonb),
    'recent_progress', COALESCE(v_recent_progress, '{}'::jsonb)
  );

  RETURN v_result;
END;
$function$;
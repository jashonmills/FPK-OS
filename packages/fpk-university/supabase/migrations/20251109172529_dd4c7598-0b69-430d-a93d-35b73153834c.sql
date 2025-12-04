-- Emergency Hotfix: Fix get_student_knowledge_pack() schema mismatches
-- This migration corrects table joins and column references that were causing SQL errors

CREATE OR REPLACE FUNCTION public.get_student_knowledge_pack(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Build the complete student knowledge pack
  SELECT jsonb_build_object(
    'generated_at', NOW(),
    'user_id', p_user_id,
    
    -- Active Courses: Pull from interactive_course_enrollments
    'active_courses', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'course_id', c.id,
          'course_title', c.title,
          'progress', COALESCE(ice.completion_percentage, 0),
          'time_spent_minutes', COALESCE(ice.time_spent_seconds / 60, 0),
          'status', CASE 
            WHEN ice.completion_percentage >= 100 THEN 'completed'
            WHEN ice.completion_percentage > 0 THEN 'in_progress'
            ELSE 'not_started'
          END,
          'last_accessed', ice.last_accessed_at
        )
      )
      FROM interactive_course_enrollments ice
      JOIN courses c ON c.id = ice.course_id
      WHERE ice.user_id = p_user_id
      ORDER BY ice.last_accessed_at DESC NULLS LAST
    ), '[]'::jsonb),
    
    -- Recent Activity: Lessons completed in last 7 days
    'recent_activity', jsonb_build_object(
      'recent_lessons', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'lesson_id', lp.lesson_id,
            'lesson_title', lp.lesson_id::text,
            'course_id', lp.course_id,
            'time_spent_seconds', lp.time_spent_seconds,
            'completed_at', lp.completed_at
          )
        )
        FROM lesson_progress lp
        WHERE lp.user_id = p_user_id
          AND lp.completed_at >= NOW() - INTERVAL '7 days'
        ORDER BY lp.completed_at DESC
        LIMIT 10
      ), '[]'::jsonb),
      
      'lessons_completed_last_7_days', COALESCE((
        SELECT COUNT(*)
        FROM lesson_progress lp
        WHERE lp.user_id = p_user_id
          AND lp.completed_at >= NOW() - INTERVAL '7 days'
      ), 0),
      
      'study_time_last_7_days', COALESCE((
        SELECT SUM(lp.time_spent_seconds) / 60
        FROM lesson_progress lp
        WHERE lp.user_id = p_user_id
          AND lp.completed_at >= NOW() - INTERVAL '7 days'
      ), 0)
    ),
    
    -- Active Learning Goals
    'active_goals', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', g.id,
          'title', g.title,
          'category', g.category,
          'progress', COALESCE(g.progress, 0),
          'target_date', g.target_date,
          'status', g.status
        )
      )
      FROM goals g
      WHERE g.user_id = p_user_id
        AND g.status IN ('active', 'in_progress')
      ORDER BY g.created_at DESC
    ), '[]'::jsonb),
    
    -- Instructor Notes: Fixed join to use org_students
    'instructor_notes', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'note', sn.note,
          'category', sn.category,
          'created_at', sn.created_at
        )
      )
      FROM student_notes sn
      JOIN org_students os ON os.id = sn.student_id
      WHERE os.linked_user_id = p_user_id
        AND sn.note_type IN ('instructor', 'observation', 'concern', 'strength')
      ORDER BY sn.created_at DESC
      LIMIT 10
    ), '[]'::jsonb),
    
    -- Strengths & Weaknesses: Calculated from lesson progress
    'strengths_weaknesses', jsonb_build_object(
      'strengths', COALESCE((
        SELECT jsonb_agg(DISTINCT lp.course_id)
        FROM lesson_progress lp
        WHERE lp.user_id = p_user_id
          AND lp.mastery_score >= 0.8
        LIMIT 5
      ), '[]'::jsonb),
      
      'weaknesses', COALESCE((
        SELECT jsonb_agg(DISTINCT lp.course_id)
        FROM lesson_progress lp
        WHERE lp.user_id = p_user_id
          AND lp.mastery_score < 0.5
        LIMIT 5
      ), '[]'::jsonb),
      
      'average_mastery', COALESCE((
        SELECT AVG(lp.mastery_score)
        FROM lesson_progress lp
        WHERE lp.user_id = p_user_id
      ), 0)
    ),
    
    -- Learning Patterns: Study habits over last 30 days
    'learning_patterns', jsonb_build_object(
      'current_streak', COALESCE((
        WITH daily_activity AS (
          SELECT DISTINCT DATE(lp.completed_at) as study_date
          FROM lesson_progress lp
          WHERE lp.user_id = p_user_id
            AND lp.completed_at >= NOW() - INTERVAL '30 days'
          ORDER BY study_date DESC
        )
        SELECT COUNT(*)
        FROM daily_activity
        WHERE study_date >= CURRENT_DATE - (
          SELECT COUNT(*) - 1
          FROM daily_activity da2
          WHERE da2.study_date >= CURRENT_DATE - INTERVAL '30 days'
        )
      ), 0),
      
      'preferred_study_times', COALESCE((
        SELECT jsonb_agg(DISTINCT EXTRACT(HOUR FROM lp.completed_at)::int)
        FROM lesson_progress lp
        WHERE lp.user_id = p_user_id
          AND lp.completed_at >= NOW() - INTERVAL '30 days'
        LIMIT 3
      ), '[]'::jsonb),
      
      'avg_session_length_minutes', COALESCE((
        SELECT AVG(lp.time_spent_seconds) / 60
        FROM lesson_progress lp
        WHERE lp.user_id = p_user_id
          AND lp.completed_at >= NOW() - INTERVAL '30 days'
      ), 0)
    ),
    
    -- Organization Context
    'organization_context', jsonb_build_object(
      'is_org_student', EXISTS(
        SELECT 1 FROM org_students os
        WHERE os.linked_user_id = p_user_id
      ),
      
      'org_memberships', COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'org_id', o.id,
            'org_name', o.name,
            'role', os.role
          )
        )
        FROM org_students os
        JOIN organizations o ON o.id = os.organization_id
        WHERE os.linked_user_id = p_user_id
      ), '[]'::jsonb),
      
      'assigned_courses', COALESCE((
        SELECT COUNT(DISTINCT ice.course_id)
        FROM interactive_course_enrollments ice
        WHERE ice.user_id = p_user_id
      ), 0)
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
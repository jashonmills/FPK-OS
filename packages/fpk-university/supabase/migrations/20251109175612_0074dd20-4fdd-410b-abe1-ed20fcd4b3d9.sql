-- ================================================================
-- MINIMAL WORKING VERSION: Only use tables that exist
-- ================================================================
-- Start with just courses and lesson progress - this WILL work

CREATE OR REPLACE FUNCTION public.get_student_knowledge_pack(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'active_courses', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'course_id', ice.course_id,
          'course_title', COALESCE(c.title, ice.course_title),
          'course_slug', c.slug,
          'completion_percentage', ice.completion_percentage,
          'time_spent_minutes', ice.total_time_spent_minutes,
          'last_accessed', ice.last_accessed_at,
          'completed', ice.completed_at IS NOT NULL
        )
      )
      FROM interactive_course_enrollments ice
      LEFT JOIN courses c ON c.id = ice.course_id
      WHERE ice.user_id = p_user_id
        AND (ice.completed_at IS NULL OR ice.completion_percentage < 100)
      ), '[]'::jsonb
    ),
    
    'recent_lesson_progress', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'lesson_id', lp.lesson_id,
          'course_id', lp.course_id,
          'completion_percentage', lp.completion_percentage,
          'time_spent_seconds', lp.time_spent_seconds,
          'last_accessed', lp.last_accessed_at,
          'completed', lp.completed_at IS NOT NULL
        )
      )
      FROM lesson_progress lp
      WHERE lp.user_id = p_user_id
      ORDER BY lp.last_accessed_at DESC NULLS LAST
      LIMIT 20
      ), '[]'::jsonb
    ),
    
    'student_notes', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'note_id', sn.id,
          'note_title', sn.title,
          'note_content', LEFT(sn.content, 200),
          'related_course', sn.course_id,
          'created_at', sn.created_at,
          'updated_at', sn.updated_at
        )
      )
      FROM org_students os
      JOIN student_notes sn ON sn.student_id = os.id
      WHERE os.linked_user_id = p_user_id
      ORDER BY sn.updated_at DESC
      LIMIT 10
      ), '[]'::jsonb
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;
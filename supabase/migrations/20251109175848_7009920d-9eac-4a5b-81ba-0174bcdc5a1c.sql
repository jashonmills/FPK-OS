-- ================================================================
-- ULTRA-MINIMAL VERSION: Course enrollments only
-- ================================================================
-- This will work immediately and can be expanded later

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
          'enrolled_at', ice.enrolled_at,
          'completed', ice.completed_at IS NOT NULL
        )
      )
      FROM interactive_course_enrollments ice
      LEFT JOIN courses c ON c.id = ice.course_id
      WHERE ice.user_id = p_user_id
      ), '[]'::jsonb
    ),
    
    'total_courses', (
      SELECT COUNT(*)::integer
      FROM interactive_course_enrollments
      WHERE user_id = p_user_id
    ),
    
    'completed_courses', (
      SELECT COUNT(*)::integer
      FROM interactive_course_enrollments
      WHERE user_id = p_user_id
        AND completed_at IS NOT NULL
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;
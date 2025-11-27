-- ================================================================
-- EMERGENCY FIX #2: Remove enrollment_status column reference
-- ================================================================
-- The interactive_course_enrollments table doesn't have an enrollment_status column
-- We need to remove that reference from the Knowledge Pack function

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
          'course_title', c.title,
          'course_slug', c.slug,
          'completion_percentage', ice.completion_percentage,
          'time_spent_minutes', ice.total_time_spent_minutes,
          'last_accessed', ice.last_accessed_at,
          'current_lesson_id', ice.current_lesson_id
        )
      )
      FROM interactive_course_enrollments ice
      JOIN courses c ON c.id = ice.course_id
      WHERE ice.user_id = p_user_id
      ), '[]'::jsonb
    ),
    
    'student_goals', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'goal_id', sg.id,
          'goal_title', sg.goal_title,
          'goal_type', sg.goal_type,
          'target_date', sg.target_date,
          'progress_percentage', sg.progress_percentage,
          'status', sg.status,
          'related_courses', sg.related_courses
        )
      )
      FROM student_goals sg
      WHERE sg.user_id = p_user_id
        AND sg.status IN ('active', 'in_progress')
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
    
    'learning_paths', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'concept_id', lpc.concept_id,
          'concept_name', kc.name,
          'concept_slug', kc.slug,
          'domain', kc.domain,
          'mastery_level', (lpc.mastery_level / 100.0),
          'status', 
            CASE 
              WHEN lpc.mastery_level >= 80 THEN 'mastered'
              WHEN lpc.mastery_level >= 40 THEN 'in_progress'
              ELSE 'learning'
            END
        )
      )
      FROM learning_path_concepts lpc
      JOIN knowledge_concepts kc ON kc.id = lpc.concept_id
      WHERE lpc.user_id = p_user_id
        AND lpc.mastery_level > 0
      ORDER BY lpc.last_interaction DESC NULLS LAST
      LIMIT 15
      ), '[]'::jsonb
    ),
    
    'concept_relationships', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'prerequisite_id', kcr.prerequisite_id,
          'dependent_id', kcr.dependent_id,
          'relationship_type', kcr.relationship_type,
          'user_mastery', (lpc.mastery_level / 100.0)
        )
      )
      FROM knowledge_concept_relationships kcr
      JOIN learning_path_concepts lpc ON lpc.concept_id = kcr.dependent_id
      WHERE lpc.user_id = p_user_id
        AND lpc.mastery_level < 80
      LIMIT 30
      ), '[]'::jsonb
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;
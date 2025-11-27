-- Fix the analytics functions with correct table names and types

DROP FUNCTION IF EXISTS get_organization_statistics(uuid);
DROP FUNCTION IF EXISTS get_organization_analytics(uuid);
DROP FUNCTION IF EXISTS get_student_analytics(text, uuid);

-- Comprehensive Organization Statistics Function
CREATE OR REPLACE FUNCTION get_organization_statistics(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
  v_student_count integer;
  v_active_members integer;
  v_course_assignments integer;
  v_active_goals integer;
  v_completed_goals integer;
  v_total_courses integer;
  v_completion_rate numeric;
  v_average_progress numeric;
  v_iep_count integer;
BEGIN
  -- Count total students (from both org_students and org_members with student role)
  SELECT COUNT(DISTINCT COALESCE(os.id::text, om.id::text))
  INTO v_student_count
  FROM org_students os
  FULL OUTER JOIN org_members om ON os.linked_user_id = om.user_id AND om.org_id = p_org_id
  WHERE os.org_id = p_org_id OR (om.org_id = p_org_id AND om.role = 'student');

  -- Count active members (students who have been active in last 30 days)
  SELECT COUNT(DISTINCT user_id)
  INTO v_active_members
  FROM activity_log
  WHERE org_id = p_org_id
    AND created_at > NOW() - INTERVAL '30 days';

  -- Count course assignments from enrollments table
  SELECT COUNT(*)
  INTO v_course_assignments
  FROM enrollments
  WHERE org_id = p_org_id;

  -- Count active goals
  SELECT COUNT(*)
  INTO v_active_goals
  FROM org_goals
  WHERE organization_id = p_org_id
    AND status = 'active';

  -- Count completed goals
  SELECT COUNT(*)
  INTO v_completed_goals
  FROM org_goals
  WHERE organization_id = p_org_id
    AND status = 'completed';

  -- Count total unique courses assigned
  SELECT COUNT(DISTINCT course_id)
  INTO v_total_courses
  FROM enrollments
  WHERE org_id = p_org_id;

  -- Calculate average progress across all enrollments
  SELECT COALESCE(AVG(progress_percent), 0)
  INTO v_average_progress
  FROM enrollments
  WHERE org_id = p_org_id;

  -- Calculate completion rate
  SELECT CASE 
    WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE progress_percent >= 100)::numeric / COUNT(*)::numeric * 100)
    ELSE 0
  END
  INTO v_completion_rate
  FROM enrollments
  WHERE org_id = p_org_id;

  -- Count IEPs
  SELECT COUNT(*)
  INTO v_iep_count
  FROM iep_documents
  WHERE org_id = p_org_id;

  -- Build result JSON
  v_result := jsonb_build_object(
    'studentCount', COALESCE(v_student_count, 0),
    'activeMembers', COALESCE(v_active_members, 0),
    'courseAssignments', COALESCE(v_course_assignments, 0),
    'activeGoals', COALESCE(v_active_goals, 0),
    'completedGoals', COALESCE(v_completed_goals, 0),
    'totalCourses', COALESCE(v_total_courses, 0),
    'averageProgress', COALESCE(ROUND(v_average_progress, 2), 0),
    'completionRate', COALESCE(ROUND(v_completion_rate, 2), 0),
    'iepCount', COALESCE(v_iep_count, 0)
  );

  RETURN v_result;
END;
$$;

-- Comprehensive Organization Analytics Function  
CREATE OR REPLACE FUNCTION get_organization_analytics(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
  v_total_students integer;
  v_active_students integer;
  v_courses_completed integer;
  v_average_progress numeric;
  v_total_learning_hours numeric;
  v_goals_completed integer;
  v_recent_activity jsonb;
  v_top_performers jsonb;
  v_iep_summary jsonb;
  v_group_count integer;
  v_notes_count integer;
BEGIN
  -- Total students
  SELECT COUNT(DISTINCT COALESCE(os.id::text, om.id::text))
  INTO v_total_students
  FROM org_students os
  FULL OUTER JOIN org_members om ON os.linked_user_id = om.user_id AND om.org_id = p_org_id
  WHERE os.org_id = p_org_id OR (om.org_id = p_org_id AND om.role = 'student');

  -- Active students (activity in last 7 days)
  SELECT COUNT(DISTINCT user_id)
  INTO v_active_students
  FROM activity_log
  WHERE org_id = p_org_id
    AND created_at > NOW() - INTERVAL '7 days';

  -- Completed courses
  SELECT COUNT(*)
  INTO v_courses_completed
  FROM enrollments
  WHERE org_id = p_org_id
    AND progress_percent >= 100;

  -- Average progress
  SELECT COALESCE(AVG(progress_percent), 0)
  INTO v_average_progress
  FROM enrollments
  WHERE org_id = p_org_id;

  -- Total learning hours (estimate from study sessions)
  SELECT COALESCE(SUM(session_duration_seconds) / 3600.0, 0)
  INTO v_total_learning_hours
  FROM study_sessions
  WHERE org_id = p_org_id;

  -- Completed goals
  SELECT COUNT(*)
  INTO v_goals_completed
  FROM org_goals
  WHERE organization_id = p_org_id
    AND status = 'completed';

  -- Count groups
  SELECT COUNT(*)
  INTO v_group_count
  FROM org_groups
  WHERE org_id = p_org_id;

  -- Count notes
  SELECT COUNT(*)
  INTO v_notes_count
  FROM org_notes
  WHERE org_id = p_org_id;

  -- Recent activity (last 10 events)
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'event', event,
      'created_at', created_at,
      'user_id', user_id,
      'metadata', metadata
    ) ORDER BY created_at DESC
  ), '[]'::jsonb)
  INTO v_recent_activity
  FROM (
    SELECT event, created_at, user_id, metadata
    FROM activity_log
    WHERE org_id = p_org_id
    ORDER BY created_at DESC
    LIMIT 10
  ) recent;

  -- Top performers (students with highest progress)
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'student_id', user_id,
      'average_progress', avg_progress,
      'courses_enrolled', course_count
    ) ORDER BY avg_progress DESC
  ), '[]'::jsonb)
  INTO v_top_performers
  FROM (
    SELECT 
      user_id,
      AVG(progress_percent) as avg_progress,
      COUNT(*) as course_count
    FROM enrollments
    WHERE org_id = p_org_id
    GROUP BY user_id
    HAVING AVG(progress_percent) > 0
    ORDER BY avg_progress DESC
    LIMIT 5
  ) top;

  -- IEP Summary
  SELECT COALESCE(jsonb_build_object(
    'total_ieps', COUNT(*),
    'active_ieps', COUNT(*) FILTER (WHERE status = 'active'),
    'pending_reviews', COUNT(*) FILTER (WHERE next_review_date < NOW() AND status = 'active'),
    'draft_ieps', COUNT(*) FILTER (WHERE status = 'draft')
  ), jsonb_build_object(
    'total_ieps', 0,
    'active_ieps', 0,
    'pending_reviews', 0,
    'draft_ieps', 0
  ))
  INTO v_iep_summary
  FROM iep_documents
  WHERE org_id = p_org_id;

  -- Build result
  v_result := jsonb_build_object(
    'totalStudents', COALESCE(v_total_students, 0),
    'activeStudents', COALESCE(v_active_students, 0),
    'coursesCompleted', COALESCE(v_courses_completed, 0),
    'averageProgress', COALESCE(ROUND(v_average_progress, 2), 0),
    'totalLearningHours', COALESCE(ROUND(v_total_learning_hours, 2), 0),
    'goalsCompleted', COALESCE(v_goals_completed, 0),
    'groupCount', COALESCE(v_group_count, 0),
    'notesCount', COALESCE(v_notes_count, 0),
    'recentActivity', v_recent_activity,
    'topPerformers', v_top_performers,
    'iepSummary', v_iep_summary
  );

  RETURN v_result;
END;
$$;

-- Function to get detailed student analytics
CREATE OR REPLACE FUNCTION get_student_analytics(p_student_id uuid, p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result jsonb;
  v_enrolled_courses integer;
  v_completed_courses integer;
  v_active_goals integer;
  v_completed_goals integer;
  v_average_progress numeric;
  v_total_study_time numeric;
  v_recent_activity jsonb;
  v_has_iep boolean;
  v_iep_goals_summary jsonb;
BEGIN
  -- Enrolled courses
  SELECT COUNT(*)
  INTO v_enrolled_courses
  FROM enrollments
  WHERE user_id = p_student_id
    AND org_id = p_org_id;

  -- Completed courses
  SELECT COUNT(*)
  INTO v_completed_courses
  FROM enrollments
  WHERE user_id = p_student_id
    AND org_id = p_org_id
    AND progress_percent >= 100;

  -- Active goals
  SELECT COUNT(*)
  INTO v_active_goals
  FROM org_goals
  WHERE (student_id = p_student_id::text OR student_id IN (
    SELECT id::text FROM org_students WHERE linked_user_id = p_student_id
  ))
  AND organization_id = p_org_id
  AND status = 'active';

  -- Completed goals
  SELECT COUNT(*)
  INTO v_completed_goals
  FROM org_goals
  WHERE (student_id = p_student_id::text OR student_id IN (
    SELECT id::text FROM org_students WHERE linked_user_id = p_student_id
  ))
  AND organization_id = p_org_id
  AND status = 'completed';

  -- Average progress
  SELECT COALESCE(AVG(progress_percent), 0)
  INTO v_average_progress
  FROM enrollments
  WHERE user_id = p_student_id
    AND org_id = p_org_id;

  -- Total study time
  SELECT COALESCE(SUM(session_duration_seconds) / 3600.0, 0)
  INTO v_total_study_time
  FROM study_sessions
  WHERE user_id = p_student_id
    AND org_id = p_org_id;

  -- Check for IEP
  SELECT EXISTS(
    SELECT 1 FROM iep_documents 
    WHERE student_id = p_student_id 
    AND org_id = p_org_id
  )
  INTO v_has_iep;

  -- IEP Goals Summary
  IF v_has_iep THEN
    SELECT jsonb_build_object(
      'total_goals', COUNT(*),
      'completed_goals', COUNT(*) FILTER (WHERE status = 'mastered' OR status = 'achieved'),
      'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
      'not_started', COUNT(*) FILTER (WHERE status = 'not_started')
    )
    INTO v_iep_goals_summary
    FROM iep_goals
    WHERE iep_document_id IN (
      SELECT id FROM iep_documents 
      WHERE student_id = p_student_id AND org_id = p_org_id
    );
  ELSE
    v_iep_goals_summary := jsonb_build_object(
      'total_goals', 0,
      'completed_goals', 0,
      'in_progress', 0,
      'not_started', 0
    );
  END IF;

  -- Recent activity
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'event', event,
      'created_at', created_at,
      'metadata', metadata
    ) ORDER BY created_at DESC
  ), '[]'::jsonb)
  INTO v_recent_activity
  FROM (
    SELECT event, created_at, metadata
    FROM activity_log
    WHERE user_id = p_student_id
      AND org_id = p_org_id
    ORDER BY created_at DESC
    LIMIT 20
  ) recent;

  v_result := jsonb_build_object(
    'enrolledCourses', COALESCE(v_enrolled_courses, 0),
    'completedCourses', COALESCE(v_completed_courses, 0),
    'activeGoals', COALESCE(v_active_goals, 0),
    'completedGoals', COALESCE(v_completed_goals, 0),
    'averageProgress', COALESCE(ROUND(v_average_progress, 2), 0),
    'totalStudyTime', COALESCE(ROUND(v_total_study_time, 2), 0),
    'hasIEP', v_has_iep,
    'iepGoalsSummary', v_iep_goals_summary,
    'recentActivity', v_recent_activity
  );

  RETURN v_result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_organization_statistics(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_organization_analytics(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_analytics(uuid, uuid) TO authenticated;
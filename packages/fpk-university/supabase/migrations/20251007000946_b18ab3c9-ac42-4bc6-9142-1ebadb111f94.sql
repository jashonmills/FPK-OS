-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_organization_statistics(uuid);
DROP FUNCTION IF EXISTS get_organization_analytics(uuid);

-- Comprehensive Organization Statistics Function
CREATE OR REPLACE FUNCTION get_organization_statistics(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
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
  SELECT COUNT(DISTINCT COALESCE(os.id, om.id::text))
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

  -- Count course assignments
  SELECT COUNT(*)
  INTO v_course_assignments
  FROM course_enrollments ce
  WHERE ce.org_id = p_org_id;

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
  FROM course_enrollments
  WHERE org_id = p_org_id;

  -- Calculate average progress across all enrollments
  SELECT COALESCE(AVG(progress_percentage), 0)
  INTO v_average_progress
  FROM course_enrollments
  WHERE org_id = p_org_id;

  -- Calculate completion rate
  SELECT CASE 
    WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE status = 'completed')::numeric / COUNT(*)::numeric * 100)
    ELSE 0
  END
  INTO v_completion_rate
  FROM course_enrollments
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
BEGIN
  -- Total students
  SELECT COUNT(DISTINCT COALESCE(os.id, om.id::text))
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
  FROM course_enrollments
  WHERE org_id = p_org_id
    AND status = 'completed';

  -- Average progress
  SELECT COALESCE(AVG(progress_percentage), 0)
  INTO v_average_progress
  FROM course_enrollments
  WHERE org_id = p_org_id;

  -- Total learning hours (estimate from session time)
  SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (completed_at - started_at)) / 3600), 0)
  INTO v_total_learning_hours
  FROM learning_sessions
  WHERE org_id = p_org_id
    AND completed_at IS NOT NULL;

  -- Completed goals
  SELECT COUNT(*)
  INTO v_goals_completed
  FROM org_goals
  WHERE organization_id = p_org_id
    AND status = 'completed';

  -- Recent activity (last 10 events)
  SELECT jsonb_agg(
    jsonb_build_object(
      'event', event,
      'created_at', created_at,
      'user_id', user_id
    ) ORDER BY created_at DESC
  )
  INTO v_recent_activity
  FROM (
    SELECT event, created_at, user_id
    FROM activity_log
    WHERE org_id = p_org_id
    ORDER BY created_at DESC
    LIMIT 10
  ) recent;

  -- Top performers (students with highest progress)
  SELECT jsonb_agg(
    jsonb_build_object(
      'student_id', student_id,
      'average_progress', avg_progress
    ) ORDER BY avg_progress DESC
  )
  INTO v_top_performers
  FROM (
    SELECT 
      student_id,
      AVG(progress_percentage) as avg_progress
    FROM course_enrollments
    WHERE org_id = p_org_id
    GROUP BY student_id
    ORDER BY avg_progress DESC
    LIMIT 5
  ) top;

  -- IEP Summary
  SELECT jsonb_build_object(
    'total_ieps', COUNT(*),
    'active_ieps', COUNT(*) FILTER (WHERE status = 'active'),
    'pending_reviews', COUNT(*) FILTER (WHERE next_review_date < NOW())
  )
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
    'recentActivity', COALESCE(v_recent_activity, '[]'::jsonb),
    'topPerformers', COALESCE(v_top_performers, '[]'::jsonb),
    'iepSummary', COALESCE(v_iep_summary, '{}'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Function to get detailed student analytics
CREATE OR REPLACE FUNCTION get_student_analytics(p_student_id text, p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
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
BEGIN
  -- Enrolled courses
  SELECT COUNT(*)
  INTO v_enrolled_courses
  FROM course_enrollments
  WHERE student_id = p_student_id
    AND org_id = p_org_id;

  -- Completed courses
  SELECT COUNT(*)
  INTO v_completed_courses
  FROM course_enrollments
  WHERE student_id = p_student_id
    AND org_id = p_org_id
    AND status = 'completed';

  -- Active goals
  SELECT COUNT(*)
  INTO v_active_goals
  FROM org_goals
  WHERE student_id = p_student_id
    AND organization_id = p_org_id
    AND status = 'active';

  -- Completed goals
  SELECT COUNT(*)
  INTO v_completed_goals
  FROM org_goals
  WHERE student_id = p_student_id
    AND organization_id = p_org_id
    AND status = 'completed';

  -- Average progress
  SELECT COALESCE(AVG(progress_percentage), 0)
  INTO v_average_progress
  FROM course_enrollments
  WHERE student_id = p_student_id
    AND org_id = p_org_id;

  -- Total study time
  SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (completed_at - started_at)) / 3600), 0)
  INTO v_total_study_time
  FROM learning_sessions
  WHERE user_id::text = p_student_id
    AND org_id = p_org_id
    AND completed_at IS NOT NULL;

  -- Recent activity
  SELECT jsonb_agg(
    jsonb_build_object(
      'event', event,
      'created_at', created_at,
      'metadata', metadata
    ) ORDER BY created_at DESC
  )
  INTO v_recent_activity
  FROM (
    SELECT event, created_at, metadata
    FROM activity_log
    WHERE user_id::text = p_student_id
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
    'recentActivity', COALESCE(v_recent_activity, '[]'::jsonb)
  );

  RETURN v_result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_organization_statistics(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_organization_analytics(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_analytics(text, uuid) TO authenticated;
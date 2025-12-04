-- Enhanced analytics functions for organization-level data

-- Function to get organization statistics
CREATE OR REPLACE FUNCTION public.get_organization_statistics(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  student_count integer;
  active_members integer;
  courses_completed integer;
  total_courses integer;
  average_progress numeric;
  total_learning_hours numeric;
  completed_goals integer;
  active_goals integer;
BEGIN
  -- Get basic organization member counts
  SELECT 
    COUNT(*) FILTER (WHERE role = 'student' AND status = 'active'),
    COUNT(*) FILTER (WHERE status = 'active' AND updated_at >= now() - interval '7 days')
  INTO student_count, active_members
  FROM public.org_members 
  WHERE org_id = p_org_id;
  
  -- Get course completion data from enrollments
  SELECT 
    COUNT(*) FILTER (WHERE completion_percentage = 100),
    COUNT(DISTINCT course_id)
  INTO courses_completed, total_courses
  FROM public.enrollments e
  JOIN public.org_members om ON om.user_id = e.user_id
  WHERE om.org_id = p_org_id AND om.status = 'active';
  
  -- Get average progress across all enrollments in the org
  SELECT COALESCE(AVG(completion_percentage), 0)
  INTO average_progress
  FROM public.enrollments e
  JOIN public.org_members om ON om.user_id = e.user_id
  WHERE om.org_id = p_org_id AND om.status = 'active';
  
  -- Get learning hours from lesson analytics
  SELECT COALESCE(SUM(time_spent_seconds), 0) / 3600.0
  INTO total_learning_hours
  FROM public.interactive_lesson_analytics ila
  JOIN public.org_members om ON om.user_id = ila.user_id
  WHERE om.org_id = p_org_id AND om.status = 'active'
  AND ila.started_at >= now() - interval '30 days';
  
  -- Get goals data
  SELECT 
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'active')
  INTO completed_goals, active_goals
  FROM public.org_goals
  WHERE org_id = p_org_id;
  
  result := jsonb_build_object(
    'studentCount', COALESCE(student_count, 0),
    'activeMembers', COALESCE(active_members, 0),
    'completedGoals', COALESCE(completed_goals, 0),
    'totalCourses', COALESCE(total_courses, 0),
    'averageProgress', COALESCE(ROUND(average_progress, 1), 0),
    'courseAssignments', COALESCE(courses_completed, 0),
    'activeGoals', COALESCE(active_goals, 0),
    'totalLearningHours', COALESCE(ROUND(total_learning_hours, 1), 0),
    'completionRate', CASE 
      WHEN total_courses > 0 THEN ROUND((courses_completed::numeric / total_courses) * 100, 1)
      ELSE 0 
    END
  );
  
  RETURN result;
END;
$$;

-- Function to get organization analytics with recent activity and top performers
CREATE OR REPLACE FUNCTION public.get_organization_analytics(p_org_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  stats jsonb;
  recent_activity jsonb;
  top_performers jsonb;
BEGIN
  -- Get basic statistics
  SELECT public.get_organization_statistics(p_org_id) INTO stats;
  
  -- Get recent activity from audit logs and lesson analytics
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', activity_id,
      'type', activity_type,
      'description', activity_description,
      'student_name', student_name,
      'activity', activity_text,
      'timestamp', activity_timestamp
    ) ORDER BY activity_timestamp DESC
  )
  INTO recent_activity
  FROM (
    -- Recent lesson completions
    SELECT 
      ila.id::text as activity_id,
      'lesson_completion' as activity_type,
      'Completed lesson' as activity_description,
      COALESCE(p.display_name, 'Student') as student_name,
      ila.lesson_title || ' in ' || ila.course_id as activity_text,
      ila.started_at as activity_timestamp
    FROM public.interactive_lesson_analytics ila
    JOIN public.org_members om ON om.user_id = ila.user_id
    LEFT JOIN public.profiles p ON p.id = ila.user_id
    WHERE om.org_id = p_org_id 
    AND om.status = 'active'
    AND ila.started_at >= now() - interval '7 days'
    AND ila.time_spent_seconds > 0
    
    UNION ALL
    
    -- Recent enrollments
    SELECT 
      e.id::text as activity_id,
      'enrollment' as activity_type,
      'Enrolled in course' as activity_description,
      COALESCE(p.display_name, 'Student') as student_name,
      'Enrolled in ' || COALESCE(c.title, e.course_id) as activity_text,
      e.enrolled_at as activity_timestamp
    FROM public.enrollments e
    JOIN public.org_members om ON om.user_id = e.user_id
    LEFT JOIN public.profiles p ON p.id = e.user_id
    LEFT JOIN public.courses c ON c.id = e.course_id
    WHERE om.org_id = p_org_id 
    AND om.status = 'active'
    AND e.enrolled_at >= now() - interval '7 days'
    
    ORDER BY activity_timestamp DESC
    LIMIT 10
  ) activities;
  
  -- Get top performers based on learning hours and completion rates
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', user_id::text,
      'name', student_name,
      'student_name', student_name,
      'score', learning_hours,
      'progress', avg_progress,
      'completed_goals', 0,
      'progress_score', ROUND(performance_score, 1)
    ) ORDER BY performance_score DESC
  )
  INTO top_performers
  FROM (
    SELECT 
      om.user_id,
      COALESCE(p.display_name, 'Student') as student_name,
      COALESCE(SUM(ila.time_spent_seconds), 0) / 3600.0 as learning_hours,
      COALESCE(AVG(e.completion_percentage), 0) as avg_progress,
      -- Weighted performance score: 70% completion + 30% engagement time
      (COALESCE(AVG(e.completion_percentage), 0) * 0.7) + 
      (LEAST(COALESCE(SUM(ila.time_spent_seconds), 0) / 3600.0 * 10, 30) * 0.3) as performance_score
    FROM public.org_members om
    LEFT JOIN public.profiles p ON p.id = om.user_id
    LEFT JOIN public.enrollments e ON e.user_id = om.user_id
    LEFT JOIN public.interactive_lesson_analytics ila ON ila.user_id = om.user_id 
      AND ila.started_at >= now() - interval '30 days'
    WHERE om.org_id = p_org_id 
    AND om.role = 'student'
    AND om.status = 'active'
    GROUP BY om.user_id, p.display_name
    HAVING COALESCE(AVG(e.completion_percentage), 0) > 0 
       OR COALESCE(SUM(ila.time_spent_seconds), 0) > 0
    ORDER BY performance_score DESC
    LIMIT 10
  ) performers;
  
  result := jsonb_build_object(
    'totalStudents', stats->>'studentCount',
    'activeStudents', stats->>'activeMembers',
    'coursesCompleted', stats->>'courseAssignments',
    'averageProgress', stats->>'averageProgress',
    'totalLearningHours', stats->>'totalLearningHours',
    'goalsCompleted', stats->>'completedGoals',
    'recentActivity', COALESCE(recent_activity, '[]'::jsonb),
    'topPerformers', COALESCE(top_performers, '[]'::jsonb)
  );
  
  RETURN result;
END;
$$;

-- Function to get admin-level analytics across all organizations
CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Only allow admin users to access this function
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  SELECT jsonb_build_object(
    'totalOrganizations', (SELECT COUNT(*) FROM public.organizations),
    'totalUsers', (SELECT COUNT(*) FROM public.profiles),
    'totalStudents', (
      SELECT COUNT(*) 
      FROM public.org_members 
      WHERE role = 'student' AND status = 'active'
    ),
    'totalCourses', (SELECT COUNT(*) FROM public.courses WHERE status = 'published'),
    'totalEnrollments', (SELECT COUNT(*) FROM public.enrollments),
    'averageProgress', (
      SELECT COALESCE(AVG(completion_percentage), 0)
      FROM public.enrollments
    ),
    'totalLearningHours', (
      SELECT COALESCE(SUM(time_spent_seconds), 0) / 3600.0
      FROM public.interactive_lesson_analytics
      WHERE started_at >= now() - interval '30 days'
    ),
    'activeOrganizations', (
      SELECT COUNT(DISTINCT om.org_id)
      FROM public.org_members om
      WHERE om.status = 'active'
      AND om.updated_at >= now() - interval '7 days'
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to get student personal analytics
CREATE OR REPLACE FUNCTION public.get_student_analytics(p_user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Users can only access their own analytics unless they're admin
  IF p_user_id != auth.uid() AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Can only access own analytics';
  END IF;
  
  SELECT jsonb_build_object(
    'totalCourses', (
      SELECT COUNT(*) 
      FROM public.enrollments 
      WHERE user_id = p_user_id
    ),
    'completedCourses', (
      SELECT COUNT(*) 
      FROM public.enrollments 
      WHERE user_id = p_user_id AND completion_percentage = 100
    ),
    'averageProgress', (
      SELECT COALESCE(AVG(completion_percentage), 0)
      FROM public.enrollments
      WHERE user_id = p_user_id
    ),
    'totalLearningHours', (
      SELECT COALESCE(SUM(time_spent_seconds), 0) / 3600.0
      FROM public.interactive_lesson_analytics
      WHERE user_id = p_user_id
      AND started_at >= now() - interval '30 days'
    ),
    'lessonsCompleted', (
      SELECT COUNT(*)
      FROM public.interactive_lesson_analytics
      WHERE user_id = p_user_id
      AND time_spent_seconds > 0
    ),
    'currentStreak', (
      SELECT COALESCE(current_streak, 0)
      FROM public.profiles
      WHERE id = p_user_id
    ),
    'totalXP', (
      SELECT COALESCE(total_xp, 0)
      FROM public.user_xp
      WHERE user_id = p_user_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
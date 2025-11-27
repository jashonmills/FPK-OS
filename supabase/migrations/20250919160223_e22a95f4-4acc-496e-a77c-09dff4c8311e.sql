-- Fix the database function to use correct column names
CREATE OR REPLACE FUNCTION public.get_organization_statistics(p_org_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
    COUNT(*) FILTER (WHERE status = 'active' AND created_at >= now() - interval '7 days')
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
$function$;
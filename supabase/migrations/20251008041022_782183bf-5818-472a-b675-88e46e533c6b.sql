-- Fix get_student_analytics function to use correct JSONB syntax for completion_percentage
CREATE OR REPLACE FUNCTION public.get_student_analytics(p_user_id uuid DEFAULT auth.uid())
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result jsonb;
BEGIN
  -- Security check: Ensure the calling user is either the target user or an admin.
  -- This is a more robust check.
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  IF p_user_id != auth.uid() AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: You can only access your own analytics.';
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
      WHERE user_id = p_user_id 
        AND (progress->>'completed')::boolean = true
    ),
    'averageProgress', (
      -- CORRECTED SYNTAX: Use the ->> operator to get the field as text, then cast.
      -- This is the critical fix.
      SELECT COALESCE(AVG(NULLIF(progress->>'completion_percentage', '')::numeric), 0)
      FROM public.enrollments
      WHERE user_id = p_user_id
        AND progress ? 'completion_percentage' -- Only consider rows where the key exists
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
$function$;
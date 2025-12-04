-- Create comprehensive analytics RPC functions for admin dashboard

-- Function to get key performance indicators
CREATE OR REPLACE FUNCTION get_analytics_kpis()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_users INTEGER;
  v_weekly_active_users INTEGER;
  v_total_enrollments INTEGER;
  v_avg_progress NUMERIC;
  v_total_time_week NUMERIC;
  v_total_orgs INTEGER;
BEGIN
  -- Total Users
  SELECT COUNT(*) INTO v_total_users
  FROM auth.users
  WHERE deleted_at IS NULL;
  
  -- Weekly Active Users (users with activity in last 7 days)
  SELECT COUNT(DISTINCT user_id) INTO v_weekly_active_users
  FROM activity_log
  WHERE created_at >= NOW() - INTERVAL '7 days';
  
  -- Total Enrollments (both regular and interactive courses)
  SELECT 
    (SELECT COUNT(*) FROM enrollments) + 
    (SELECT COUNT(*) FROM interactive_course_enrollments)
  INTO v_total_enrollments;
  
  -- Average Course Progress
  SELECT COALESCE(AVG(completion_percentage), 0) INTO v_avg_progress
  FROM interactive_course_enrollments;
  
  -- Total Time Spent this week (in hours)
  SELECT COALESCE(SUM(total_time_spent_minutes), 0) / 60.0 INTO v_total_time_week
  FROM interactive_course_enrollments ice
  WHERE ice.last_accessed_at >= NOW() - INTERVAL '7 days';
  
  -- Total Organizations
  SELECT COUNT(*) INTO v_total_orgs
  FROM organizations;
  
  RETURN jsonb_build_object(
    'totalUsers', v_total_users,
    'weeklyActiveUsers', v_weekly_active_users,
    'totalEnrollments', v_total_enrollments,
    'avgCourseProgress', ROUND(v_avg_progress, 1),
    'totalTimeWeek', ROUND(v_total_time_week, 1),
    'totalOrganizations', v_total_orgs
  );
END;
$$;

-- Function to get daily active users for the last N days
CREATE OR REPLACE FUNCTION get_daily_active_users(days_limit INT DEFAULT 30)
RETURNS TABLE(
  activity_date DATE,
  active_users BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (days_limit - 1),
      CURRENT_DATE,
      '1 day'::INTERVAL
    )::DATE as date
  )
  SELECT 
    ds.date as activity_date,
    COALESCE(COUNT(DISTINCT al.user_id), 0) as active_users
  FROM date_series ds
  LEFT JOIN activity_log al ON DATE(al.created_at) = ds.date
  GROUP BY ds.date
  ORDER BY ds.date;
END;
$$;

-- Function to get time spent by day for last 7 days
CREATE OR REPLACE FUNCTION get_time_spent_by_day()
RETURNS TABLE(
  day_name TEXT,
  total_hours NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH last_7_days AS (
    SELECT generate_series(
      CURRENT_DATE - 6,
      CURRENT_DATE,
      '1 day'::INTERVAL
    )::DATE as date
  )
  SELECT 
    TO_CHAR(ld.date, 'Dy') as day_name,
    COALESCE(
      SUM(
        CASE 
          WHEN DATE(ss.created_at) = ld.date 
          THEN ss.session_duration_seconds / 3600.0
          ELSE 0 
        END
      ) +
      SUM(
        CASE 
          WHEN DATE(rs.session_start) = ld.date 
          THEN rs.duration_seconds / 3600.0
          ELSE 0 
        END
      ),
      0
    ) as total_hours
  FROM last_7_days ld
  LEFT JOIN study_sessions ss ON DATE(ss.created_at) = ld.date
  LEFT JOIN reading_sessions rs ON DATE(rs.session_start) = ld.date
  GROUP BY ld.date, TO_CHAR(ld.date, 'Dy')
  ORDER BY ld.date;
END;
$$;

-- Function to get course enrollment statistics
CREATE OR REPLACE FUNCTION get_course_enrollment_stats()
RETURNS TABLE(
  course_id TEXT,
  course_title TEXT,
  enrollment_count BIGINT,
  completion_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ice.course_id,
    CASE ice.course_id
      WHEN 'introduction-modern-economics' THEN 'Introduction to Modern Economics'
      WHEN 'interactive-algebra' THEN 'Interactive Algebra'
      WHEN 'interactive-trigonometry' THEN 'Interactive Trigonometry'
      WHEN 'interactive-linear-equations' THEN 'Linear Equations Mastery'
      WHEN 'logic-critical-thinking' THEN 'Logic & Critical Thinking'
      WHEN 'interactive-science' THEN 'Interactive Science'
      WHEN 'neurodiversity-strengths-based-approach' THEN 'Neurodiversity: Strengths-Based Approach'
      WHEN 'learning-state-beta' THEN 'Optimal Learning States'
      WHEN 'el-spelling-reading' THEN 'EL Spelling & Reading'
      ELSE ice.course_id
    END as course_title,
    COUNT(*) as enrollment_count,
    ROUND(
      AVG(CASE WHEN ice.completion_percentage >= 100 THEN 100 ELSE 0 END),
      1
    ) as completion_rate
  FROM interactive_course_enrollments ice
  GROUP BY ice.course_id
  ORDER BY enrollment_count DESC
  LIMIT 10;
END;
$$;

-- Function to get overall completion status breakdown
CREATE OR REPLACE FUNCTION get_completion_breakdown()
RETURNS TABLE(
  status TEXT,
  count BIGINT,
  percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total BIGINT;
BEGIN
  SELECT COUNT(*) INTO v_total FROM interactive_course_enrollments;
  
  IF v_total = 0 THEN
    RETURN QUERY SELECT 'Not Started'::TEXT, 0::BIGINT, 0::NUMERIC;
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    'Not Started' as status,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / v_total), 1) as percentage
  FROM interactive_course_enrollments
  WHERE completion_percentage = 0
  
  UNION ALL
  
  SELECT 
    'In Progress' as status,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / v_total), 1) as percentage
  FROM interactive_course_enrollments
  WHERE completion_percentage > 0 AND completion_percentage < 100
  
  UNION ALL
  
  SELECT 
    'Completed' as status,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / v_total), 1) as percentage
  FROM interactive_course_enrollments
  WHERE completion_percentage >= 100;
END;
$$;

-- Function to get organization leaderboard
CREATE OR REPLACE FUNCTION get_organization_leaderboard()
RETURNS TABLE(
  org_id UUID,
  org_name TEXT,
  member_count BIGINT,
  total_enrollments BIGINT,
  avg_progress NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id as org_id,
    o.name as org_name,
    COUNT(DISTINCT om.user_id) as member_count,
    COUNT(DISTINCT ice.id) as total_enrollments,
    ROUND(COALESCE(AVG(ice.completion_percentage), 0), 1) as avg_progress
  FROM organizations o
  LEFT JOIN org_members om ON om.org_id = o.id AND om.status = 'active'
  LEFT JOIN interactive_course_enrollments ice ON ice.user_id = om.user_id
  GROUP BY o.id, o.name
  HAVING COUNT(DISTINCT om.user_id) > 0
  ORDER BY total_enrollments DESC, avg_progress DESC
  LIMIT 10;
END;
$$;
-- Fix search_path security warnings for analytics functions
ALTER FUNCTION get_analytics_kpis() SET search_path TO 'public';
ALTER FUNCTION get_daily_active_users(INT) SET search_path TO 'public';
ALTER FUNCTION get_time_spent_by_day() SET search_path TO 'public';
ALTER FUNCTION get_course_enrollment_stats() SET search_path TO 'public';
ALTER FUNCTION get_completion_breakdown() SET search_path TO 'public';
ALTER FUNCTION get_organization_leaderboard() SET search_path TO 'public';
-- Phase 1: Enable real-time for analytics tables
-- Add replica identity for real-time tracking
ALTER TABLE public.interactive_course_enrollments REPLICA IDENTITY FULL;
ALTER TABLE public.interactive_lesson_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.activity_log REPLICA IDENTITY FULL;
ALTER TABLE public.org_goals REPLICA IDENTITY FULL;
ALTER TABLE public.org_notes REPLICA IDENTITY FULL;
ALTER TABLE public.interactive_course_sessions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactive_course_enrollments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactive_lesson_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.org_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.org_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interactive_course_sessions;
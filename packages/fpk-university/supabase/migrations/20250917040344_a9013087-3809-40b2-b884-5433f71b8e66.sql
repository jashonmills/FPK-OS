-- Add unique constraint for lesson completion tracking
-- This ensures one record per user per course per lesson
ALTER TABLE public.interactive_lesson_analytics 
ADD CONSTRAINT unique_user_course_lesson 
UNIQUE (user_id, course_id, lesson_id);
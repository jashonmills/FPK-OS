-- Clean up duplicate lesson analytics records and fix the constraint issue
-- Keep the most recent record for each user/course/lesson combination

-- Create a temporary table with only the latest record for each user/course/lesson
CREATE TEMP TABLE lesson_analytics_clean AS
SELECT DISTINCT ON (user_id, course_id, lesson_id) *
FROM public.interactive_lesson_analytics
ORDER BY user_id, course_id, lesson_id, created_at DESC;

-- Delete all existing records
DELETE FROM public.interactive_lesson_analytics;

-- Insert the cleaned records back
INSERT INTO public.interactive_lesson_analytics 
SELECT * FROM lesson_analytics_clean;

-- Now add the unique constraint
ALTER TABLE public.interactive_lesson_analytics 
ADD CONSTRAINT unique_user_course_lesson 
UNIQUE (user_id, course_id, lesson_id);
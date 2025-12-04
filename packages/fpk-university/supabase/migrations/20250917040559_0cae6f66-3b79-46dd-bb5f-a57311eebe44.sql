-- Add unique constraint for course enrollments
-- This ensures one record per user per course
ALTER TABLE public.interactive_course_enrollments 
ADD CONSTRAINT unique_user_course_enrollment 
UNIQUE (user_id, course_id);
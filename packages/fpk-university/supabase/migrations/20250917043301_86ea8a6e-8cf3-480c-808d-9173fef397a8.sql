-- Remove enrollments for Learning State Beta course first, then remove the course
DELETE FROM public.enrollments WHERE course_id = 'learning-state-beta';
DELETE FROM public.courses WHERE id = 'learning-state-beta';
-- Remove the Algebra Pathfinder SCORM converted course
-- First delete any enrollments for this course
DELETE FROM enrollments WHERE course_id = '8ef71d5e-2770-41bc-bcc2-ce6343eb11bf';

-- Then delete the course itself
DELETE FROM native_courses WHERE id = '8ef71d5e-2770-41bc-bcc2-ce6343eb11bf';
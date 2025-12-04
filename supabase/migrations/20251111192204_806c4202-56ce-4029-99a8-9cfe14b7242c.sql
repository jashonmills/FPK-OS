-- Fix incorrect course_id in student_course_assignments
-- Change 'el-spelling-reading' to 'el-reading' to match the actual course
UPDATE public.student_course_assignments 
SET course_id = 'el-reading'
WHERE course_id = 'el-spelling-reading';
-- Complete cascade deletion including organization assignments
-- VERIFIED: Deleting 'el-spelling-reading' (broken course)

-- Delete organization course assignments first
DELETE FROM organization_course_assignments
WHERE course_id = 'el-spelling-reading';

-- Delete interactive course enrollments
DELETE FROM interactive_course_enrollments
WHERE course_id = 'el-spelling-reading';

-- Delete regular enrollments
DELETE FROM enrollments
WHERE course_id = 'el-spelling-reading';

-- Finally delete the broken course
DELETE FROM courses
WHERE slug = 'el-spelling-reading';
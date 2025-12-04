-- Update organization assignment from old reading course to new one
UPDATE public.organization_course_assignments
SET course_id = 'el-reading'
WHERE course_id = 'empowering-learning-reading'
AND is_active = true;
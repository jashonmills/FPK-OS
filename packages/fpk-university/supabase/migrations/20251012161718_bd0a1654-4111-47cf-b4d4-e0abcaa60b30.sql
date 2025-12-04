-- Comprehensive migration to remove duplicate "Empowering Learning State" course
-- Step 1: Migrate organization course assignments
UPDATE organization_course_assignments 
SET course_id = 'learning-state-beta'
WHERE course_id = 'empowering-learning-state'
AND NOT EXISTS (
  SELECT 1 FROM organization_course_assignments oca2 
  WHERE oca2.organization_id = organization_course_assignments.organization_id 
  AND oca2.course_id = 'learning-state-beta'
);

-- Delete remaining duplicate org course assignments
DELETE FROM organization_course_assignments
WHERE course_id = 'empowering-learning-state';

-- Step 2: Migrate regular enrollments
UPDATE enrollments 
SET course_id = 'learning-state-beta'
WHERE course_id = 'empowering-learning-state'
AND NOT EXISTS (
  SELECT 1 FROM enrollments e2 
  WHERE e2.user_id = enrollments.user_id 
  AND e2.course_id = 'learning-state-beta'
);

-- Delete remaining duplicate enrollments
DELETE FROM enrollments
WHERE course_id = 'empowering-learning-state';

-- Step 3: Migrate interactive course enrollments
UPDATE interactive_course_enrollments 
SET course_id = 'learning-state-beta'
WHERE course_id = 'empowering-learning-state'
AND NOT EXISTS (
  SELECT 1 FROM interactive_course_enrollments ice2 
  WHERE ice2.user_id = interactive_course_enrollments.user_id 
  AND ice2.course_id = 'learning-state-beta'
);

-- Delete remaining duplicate interactive enrollments
DELETE FROM interactive_course_enrollments
WHERE course_id = 'empowering-learning-state';

-- Step 4: Finally delete the duplicate course
DELETE FROM courses WHERE id = 'empowering-learning-state';
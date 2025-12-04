-- Remove duplicate "Empowering Learning for Spelling" course and migrate to EL Spelling & Reading

-- Step 1: Migrate interactive course enrollments from UUID course to el-spelling-reading
UPDATE interactive_course_enrollments 
SET course_id = 'el-spelling-reading'
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae'
AND NOT EXISTS (
  SELECT 1 FROM interactive_course_enrollments ice2 
  WHERE ice2.user_id = interactive_course_enrollments.user_id 
  AND ice2.course_id = 'el-spelling-reading'
);

-- Delete remaining duplicate interactive enrollments
DELETE FROM interactive_course_enrollments
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 2: Migrate organization course assignments if any exist
UPDATE organization_course_assignments 
SET course_id = 'el-spelling-reading'
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae'
AND NOT EXISTS (
  SELECT 1 FROM organization_course_assignments oca2 
  WHERE oca2.organization_id = organization_course_assignments.organization_id 
  AND oca2.course_id = 'el-spelling-reading'
);

-- Delete remaining duplicate org course assignments
DELETE FROM organization_course_assignments
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 3: Migrate regular enrollments if any exist
UPDATE enrollments 
SET course_id = 'el-spelling-reading'
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae'
AND NOT EXISTS (
  SELECT 1 FROM enrollments e2 
  WHERE e2.user_id = enrollments.user_id 
  AND e2.course_id = 'el-spelling-reading'
);

-- Delete remaining duplicate enrollments
DELETE FROM enrollments
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 4: Migrate student course assignments if any exist
UPDATE student_course_assignments
SET course_id = 'el-spelling-reading'
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae'
AND NOT EXISTS (
  SELECT 1 FROM student_course_assignments sca2
  WHERE sca2.student_id = student_course_assignments.student_id
  AND sca2.course_id = 'el-spelling-reading'
  AND sca2.org_id = student_course_assignments.org_id
);

-- Delete remaining duplicate student course assignments
DELETE FROM student_course_assignments
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 5: Finally delete the duplicate course record
DELETE FROM courses WHERE id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';
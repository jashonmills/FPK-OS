-- Remove Dr. Sarah Martinez from EL Spelling & Reading course
UPDATE courses 
SET instructor_name = NULL 
WHERE id = 'el-spelling-reading' AND instructor_name = 'Dr. Sarah Martinez';
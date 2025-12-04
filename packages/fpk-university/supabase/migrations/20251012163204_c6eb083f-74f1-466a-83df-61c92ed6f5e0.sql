-- Delete native "Empowering Learning for Spelling" course and all enrollments

-- Step 1: Delete all native enrollments for this course
DELETE FROM native_enrollments
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 2: Delete any course progress records
DELETE FROM course_progress
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 3: Delete any student course assignments
DELETE FROM student_course_assignments
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 4: Delete any organization course assignments
DELETE FROM organization_course_assignments
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 5: Delete any course collection items
DELETE FROM course_collection_items
WHERE course_id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';

-- Step 6: Finally delete the native course itself
DELETE FROM native_courses
WHERE id = '06efda03-9f0b-4c00-a064-eb65ada9fbae';
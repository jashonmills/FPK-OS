-- Auto-enroll current user in the Algebra Pathfinder course
INSERT INTO native_enrollments (user_id, course_id, status, progress_pct, enrolled_at, last_visit_at)
SELECT 
  auth.uid(),
  id,
  'active',
  0,
  now(),
  now()
FROM native_courses 
WHERE title = 'Algebra Pathfinder (Converted from SCORM)'
AND NOT EXISTS (
  SELECT 1 FROM native_enrollments 
  WHERE user_id = auth.uid() 
  AND course_id = native_courses.id
);
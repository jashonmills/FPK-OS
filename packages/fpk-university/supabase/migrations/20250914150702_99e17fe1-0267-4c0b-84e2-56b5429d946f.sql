-- Create a test enrollment for the current user in the Economics course (if authenticated)
INSERT INTO native_enrollments (course_id, user_id, progress_pct, status, enrolled_at)
SELECT 
  '00853151-8194-459a-8b63-15eec567d75c',
  auth.uid(),
  0,
  'active',
  now()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (course_id, user_id) DO NOTHING;
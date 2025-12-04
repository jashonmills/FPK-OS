-- Bulk enroll existing St. Joseph Mail organization students in preloaded courses
-- Organization ID: 446d78ee-420e-4e9a-8d9d-00f06e897e7f

-- 1. Enroll in 4 platform courses (el-handwriting, empowering-learning-numeracy, empowering-learning-reading, empowering-learning-state)
INSERT INTO enrollments (user_id, course_id, enrolled_at, progress)
SELECT 
  om.user_id,
  course_id,
  NOW(),
  '{"completed": false, "current_module": null, "completion_percentage": 0}'::jsonb
FROM org_members om
CROSS JOIN (
  VALUES 
    ('el-handwriting'),
    ('empowering-learning-numeracy'),
    ('empowering-learning-reading'),
    ('empowering-learning-state')
) AS courses(course_id)
WHERE om.org_id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f'
  AND om.status = 'active'
  AND om.role = 'student'
ON CONFLICT (user_id, course_id) DO NOTHING;

-- 2. Enroll in native spelling course (06efda03-9f0b-4c00-a064-eb65ada9fbae)
INSERT INTO native_enrollments (user_id, course_id, status, progress_pct, last_visit_at, enrolled_at)
SELECT 
  om.user_id,
  '06efda03-9f0b-4c00-a064-eb65ada9fbae'::uuid,
  'active',
  0,
  NOW(),
  NOW()
FROM org_members om
WHERE om.org_id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f'
  AND om.status = 'active'
  AND om.role = 'student'
ON CONFLICT (user_id, course_id) DO NOTHING;
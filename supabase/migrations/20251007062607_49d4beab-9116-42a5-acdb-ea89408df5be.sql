-- Step 1: Create database entry for Optimal Learning State Course
INSERT INTO courses (id, title, slug, source, status, discoverable, description, duration_minutes, difficulty_level, thumbnail_url)
VALUES (
  'learning-state-beta',
  'Optimal Learning State Course',
  'optimal-learning-state',
  'platform',
  'published',
  false,
  'Master the optimal learning state through calming techniques, grounding exercises, and focus strategies. Learn practical tools to regulate your nervous system and create ideal conditions for learning.',
  180,
  'beginner',
  '/assets/learning-state-course-bg.jpg'
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Remove current assignment of Empowering Learning State from St. Joseph's
DELETE FROM organization_course_assignments
WHERE organization_id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f'
AND course_id = 'empowering-learning-state';

-- Step 3: Assign Optimal Learning State to St. Joseph's (using NULL for assigned_by since this is a migration)
INSERT INTO organization_course_assignments (organization_id, course_id, assigned_by)
SELECT 
  '446d78ee-420e-4e9a-8d9d-00f06e897e7f',
  'learning-state-beta',
  owner_id
FROM organizations
WHERE id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f'
LIMIT 1;
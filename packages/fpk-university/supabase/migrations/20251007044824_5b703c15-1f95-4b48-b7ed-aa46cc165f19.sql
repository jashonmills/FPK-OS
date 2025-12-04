-- Step 1: Publish the draft courses
UPDATE courses 
SET status = 'published', updated_at = now()
WHERE id IN ('empowering-learning-reading', 'empowering-learning-numeracy');

-- Step 2: Create the missing "Empowering Learning for Spelling" course
INSERT INTO courses (
  id,
  title,
  description,
  difficulty_level,
  status,
  course_visibility,
  featured,
  instructor_name,
  source
) VALUES (
  '06efda03-9f0b-4c00-a064-eb65ada9fbae',
  'Empowering Learning for Spelling',
  'Comprehensive spelling strategies for neurodiverse learners',
  'beginner',
  'published',
  'global',
  false,
  'FPK University',
  'platform'
) ON CONFLICT (id) DO UPDATE SET
  status = 'published',
  updated_at = now();
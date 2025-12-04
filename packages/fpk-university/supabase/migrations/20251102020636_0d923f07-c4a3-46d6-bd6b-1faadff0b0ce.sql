-- Insert or update Math 6.3: Introduction to Algebra, Statistics & Probability course
INSERT INTO public.courses (
  id,
  slug,
  title,
  description,
  background_image,
  thumbnail_url,
  framework_type,
  content_version,
  status,
  discoverable
) VALUES (
  'math-6-3-algebra-stats-probability',
  'math-6-3-algebra-stats-probability',
  'Math 6.3: Introduction to Algebra, Statistics & Probability',
  'This course introduces three critical areas of mathematics: using variables to solve problems, understanding data, and analyzing chance.',
  '/course-images/math-6-3-algebra-stats-probability-bg.jpg',
  '/course-images/math-6-3-algebra-stats-probability-thumbnail.jpg',
  'sequential',
  'v2',
  'published',
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  background_image = EXCLUDED.background_image,
  thumbnail_url = EXCLUDED.thumbnail_url,
  framework_type = 'sequential',
  content_version = 'v2',
  status = 'published',
  discoverable = true;

-- Clean up any legacy module data
DELETE FROM public.modules WHERE course_id = 'math-6-3-algebra-stats-probability';
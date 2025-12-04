-- Insert or update Math 8.2: Pythagorean Theorem & Geometric Transformations course
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
  'math-8-2-pythagorean-theorem-geometric-transformations',
  'math-8-2-pythagorean-theorem-geometric-transformations',
  'Math 8.2: Pythagorean Theorem & Geometric Transformations',
  'Unlock the secrets of right triangles with the Pythagorean Theorem and learn to manipulate shapes on the coordinate plane through transformations.',
  '/course-images/math-8-2-pythagorean-theorem-geometric-transformations-bg.jpg',
  '/course-images/math-8-2-pythagorean-theorem-geometric-transformations-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'math-8-2-pythagorean-theorem-geometric-transformations';
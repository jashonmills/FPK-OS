-- Insert or update Math 8.1: Linear Equations & Functions course
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
  'math-8-1-linear-equations-functions',
  'math-8-1-linear-equations-functions',
  'Math 8.1: Linear Equations & Functions',
  'Dive into the core of algebra by graphing lines, understanding functions, and solving systems of linear equations.',
  '/course-images/math-8-1-linear-equations-functions-bg.jpg',
  '/course-images/math-8-1-linear-equations-functions-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'math-8-1-linear-equations-functions';
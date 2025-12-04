-- Insert or update Biology: The Study of Life course
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
  'biology-the-study-of-life',
  'biology-the-study-of-life',
  'Biology: The Study of Life',
  'An interactive exploration of the fundamental principles of life, from the inner workings of cells and DNA to the dynamics of entire ecosystems.',
  '/course-images/biology-the-study-of-life-bg.jpg',
  '/course-images/biology-the-study-of-life-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'biology-the-study-of-life';
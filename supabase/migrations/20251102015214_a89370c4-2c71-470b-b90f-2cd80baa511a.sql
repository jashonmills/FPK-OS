-- Insert or update Pre-Calculus course
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
  'pre-calculus',
  'pre-calculus',
  'Pre-Calculus',
  'This course bridges the gap between Algebra and Calculus, covering advanced functions, trigonometry, and analytical geometry to prepare students for higher-level mathematics.',
  '/course-images/pre-calculus-bg.jpg',
  '/course-images/pre-calculus-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'pre-calculus';
-- Insert or update Introduction to Calculus course
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
  'introduction-to-calculus',
  'introduction-to-calculus',
  'Introduction to Calculus',
  'An interactive introduction to the foundational concepts of calculus. This course covers limits, derivatives, and integrals, essential for students pursuing STEM fields.',
  '/course-images/introduction-to-calculus-bg.jpg',
  '/course-images/introduction-to-calculus-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'introduction-to-calculus';
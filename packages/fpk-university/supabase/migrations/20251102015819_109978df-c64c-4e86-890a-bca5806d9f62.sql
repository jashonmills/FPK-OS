-- Insert or update Introduction to Philosophy course
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
  'introduction-to-philosophy',
  'introduction-to-philosophy',
  'Introduction to Philosophy',
  'What is real? How do we know what we know? What does it mean to be good? This course tackles the biggest questions in life, introducing you to the foundational ideas of the world''s greatest thinkers.',
  '/course-images/introduction-to-philosophy-bg.jpg',
  '/course-images/introduction-to-philosophy-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'introduction-to-philosophy';
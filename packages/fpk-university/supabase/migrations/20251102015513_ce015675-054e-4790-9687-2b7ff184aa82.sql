-- Insert or update World History: Ancient Civilizations to the Modern Era course
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
  'world-history-ancient-to-modern',
  'world-history-ancient-to-modern',
  'World History: Ancient Civilizations to the Modern Era',
  'A sweeping survey of human history, tracing the development of societies, cultures, and empires from the ancient world to the interconnected global stage of today.',
  '/course-images/world-history-ancient-to-modern-bg.jpg',
  '/course-images/world-history-ancient-to-modern-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'world-history-ancient-to-modern';
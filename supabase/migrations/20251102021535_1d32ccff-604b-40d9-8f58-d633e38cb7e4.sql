-- Insert or update Social Studies 6.1: Ancient Civilizations course
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
  'social-studies-6-1-ancient-civilizations',
  'social-studies-6-1-ancient-civilizations',
  'Social Studies 6.1: Ancient Civilizations (Mesopotamia, Egypt, Greece)',
  'Journey back in time to explore the foundational civilizations of the ancient world and their lasting impact on our own.',
  '/course-images/social-studies-6-1-ancient-civilizations-bg.jpg',
  '/course-images/social-studies-6-1-ancient-civilizations-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'social-studies-6-1-ancient-civilizations';
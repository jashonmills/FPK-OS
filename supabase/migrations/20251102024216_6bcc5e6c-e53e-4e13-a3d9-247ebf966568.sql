-- Insert or update ELA 8.1: Rhetoric, Persuasion & Media Literacy course
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
  'ela-8-1-rhetoric-persuasion-media-literacy',
  'ela-8-1-rhetoric-persuasion-media-literacy',
  'ELA 8.1: Rhetoric, Persuasion & Media Literacy',
  'Learn to analyze how authors and creators influence audiences, and develop the critical skills to become a savvy consumer and creator of media.',
  '/course-images/ela-8-1-rhetoric-persuasion-media-literacy-bg.jpg',
  '/course-images/ela-8-1-rhetoric-persuasion-media-literacy-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'ela-8-1-rhetoric-persuasion-media-literacy';
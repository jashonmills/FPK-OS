-- Insert or update ELA 8.2: American Literature & Historical Context course
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
  'ela-8-2-american-literature-historical-context',
  'ela-8-2-american-literature-historical-context',
  'ELA 8.2: American Literature & Historical Context',
  'Explore key works of American literature and understand how they were shaped by the historical events, social movements, and cultural values of their time.',
  '/course-images/ela-8-2-american-literature-historical-context-bg.jpg',
  '/course-images/ela-8-2-american-literature-historical-context-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'ela-8-2-american-literature-historical-context';
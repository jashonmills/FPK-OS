-- Insert or update ELA 7.2: Research Writing & Information Literacy course
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
  'ela-7-2-research-writing-information-literacy',
  'ela-7-2-research-writing-information-literacy',
  'ELA 7.2: Research Writing & Information Literacy',
  'Learn how to ask powerful questions, find credible information, and synthesize it into a well-structured research paper.',
  '/course-images/ela-7-2-research-writing-information-literacy-bg.jpg',
  '/course-images/ela-7-2-research-writing-information-literacy-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'ela-7-2-research-writing-information-literacy';
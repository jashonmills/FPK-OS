-- Insert or update ELA 7.3: Creative Writing - Short Stories & Poetry course
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
  'ela-7-3-creative-writing-short-stories-poetry',
  'ela-7-3-creative-writing-short-stories-poetry',
  'ELA 7.3: Creative Writing - Short Stories & Poetry',
  'Discover the building blocks of powerful storytelling and expressive poetry, and learn the techniques to craft your own original works.',
  '/course-images/ela-7-3-creative-writing-short-stories-poetry-bg.jpg',
  '/course-images/ela-7-3-creative-writing-short-stories-poetry-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'ela-7-3-creative-writing-short-stories-poetry';
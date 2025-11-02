-- Insert or update Introduction to Literature: Analyzing Fiction course
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
  'introduction-to-literature-analyzing-fiction',
  'introduction-to-literature-analyzing-fiction',
  'Introduction to Literature: Analyzing Fiction',
  'This course moves beyond basic literacy to teach critical analysis. Students will learn about literary devices, themes, and symbolism by studying classic and modern short stories and novels.',
  '/course-images/introduction-to-literature-analyzing-fiction-bg.jpg',
  '/course-images/introduction-to-literature-analyzing-fiction-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'introduction-to-literature-analyzing-fiction';
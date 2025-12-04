-- Insert or update AP Biology course
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
  'ap-biology',
  'ap-biology',
  'AP Biology',
  'A college-level course exploring the core principles of biology, from biochemistry and evolution to complex ecosystems. Aligned with the AP curriculum to prepare students for the exam.',
  '/course-images/ap-biology-bg.jpg',
  '/course-images/ap-biology-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'ap-biology';
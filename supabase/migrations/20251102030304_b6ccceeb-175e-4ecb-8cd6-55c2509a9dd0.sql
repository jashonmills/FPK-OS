-- Insert or update Science 8.3: Environmental Science & Sustainability course
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
  'science-8-3-environmental-science-sustainability',
  'science-8-3-environmental-science-sustainability',
  'Science 8.3: Environmental Science & Sustainability',
  'Explore the intricate connections within Earth''s ecosystems, understand the impact of human activity, and learn about the solutions that can lead to a sustainable future.',
  '/course-images/science-8-3-environmental-science-sustainability-bg.jpg',
  '/course-images/science-8-3-environmental-science-sustainability-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-8-3-environmental-science-sustainability';
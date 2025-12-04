-- Insert or update Science 7.1: Life Science - Human Body Systems course
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
  'science-7-1-life-science-human-body-systems',
  'science-7-1-life-science-human-body-systems',
  'Science 7.1: Life Science - Human Body Systems',
  'Take a journey through the intricate and interconnected systems that make up the human body, from the skeleton that supports you to the brain that directs you.',
  '/course-images/science-7-1-life-science-human-body-systems-bg.jpg',
  '/course-images/science-7-1-life-science-human-body-systems-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-7-1-life-science-human-body-systems';
-- Insert or update Science 6.1: Earth Science - Geology & Weather course
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
  'science-6-1-earth-science-geology-weather',
  'science-6-1-earth-science-geology-weather',
  'Science 6.1: Earth Science - Geology & Weather',
  'Explore the dynamic forces that shape our planet, from the rocks beneath our feet to the weather patterns in the sky.',
  '/course-images/science-6-1-earth-science-geology-weather-bg.jpg',
  '/course-images/science-6-1-earth-science-geology-weather-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-6-1-earth-science-geology-weather';
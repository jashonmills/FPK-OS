-- Insert or update Science 7.3: Earth Science - Space & Astronomy course
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
  'science-7-3-earth-science-space-astronomy',
  'science-7-3-earth-science-space-astronomy',
  'Science 7.3: Earth Science - Space & Astronomy',
  'Journey from our home planet to the farthest reaches of the universe, exploring stars, galaxies, and the forces that shape the cosmos.',
  '/course-images/science-7-3-earth-science-space-astronomy-bg.jpg',
  '/course-images/science-7-3-earth-science-space-astronomy-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-7-3-earth-science-space-astronomy';
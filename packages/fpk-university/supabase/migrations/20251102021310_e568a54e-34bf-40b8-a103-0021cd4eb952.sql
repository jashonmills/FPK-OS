-- Insert or update Science 6.3: Physical Science - Matter, Energy & Forces course
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
  'science-6-3-physical-science-matter-energy-forces',
  'science-6-3-physical-science-matter-energy-forces',
  'Science 6.3: Physical Science - Matter, Energy & Forces',
  'An introduction to the fundamental concepts of the physical world, including the nature of matter, the forms of energy, and the forces that govern motion.',
  '/course-images/science-6-3-physical-science-matter-energy-forces-bg.jpg',
  '/course-images/science-6-3-physical-science-matter-energy-forces-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-6-3-physical-science-matter-energy-forces';
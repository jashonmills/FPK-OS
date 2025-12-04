-- Insert or update Science 8.1: Physical Science - Physics Fundamentals course
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
  'science-8-1-physical-science-physics-fundamentals',
  'science-8-1-physical-science-physics-fundamentals',
  'Science 8.1: Physical Science - Physics Fundamentals',
  'Explore the laws that govern motion, forces, and energy, from the simple machines around us to the waves that carry sound and light.',
  '/course-images/science-8-1-physical-science-physics-fundamentals-bg.jpg',
  '/course-images/science-8-1-physical-science-physics-fundamentals-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-8-1-physical-science-physics-fundamentals';
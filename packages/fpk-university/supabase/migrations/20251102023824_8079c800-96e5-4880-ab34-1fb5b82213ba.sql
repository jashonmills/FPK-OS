-- Insert or update Science 7.2: Physical Science - Chemistry Basics course
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
  'science-7-2-physical-science-chemistry-basics',
  'science-7-2-physical-science-chemistry-basics',
  'Science 7.2: Physical Science - Chemistry Basics',
  'Explore the building blocks of everything around you, from the atoms that make up matter to the chemical reactions that transform it.',
  '/course-images/science-7-2-physical-science-chemistry-basics-bg.jpg',
  '/course-images/science-7-2-physical-science-chemistry-basics-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-7-2-physical-science-chemistry-basics';
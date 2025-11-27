-- Insert or update Science 8.2: Chemistry - Chemical Reactions & Periodic Table course
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
  'science-8-2-chemistry-chemical-reactions-periodic-table',
  'science-8-2-chemistry-chemical-reactions-periodic-table',
  'Science 8.2: Chemistry - Chemical Reactions & Periodic Table',
  'Dive deeper into chemistry by exploring the organization of the periodic table and learning how to balance and classify chemical reactions.',
  '/course-images/science-8-2-chemistry-chemical-reactions-periodic-table-bg.jpg',
  '/course-images/science-8-2-chemistry-chemical-reactions-periodic-table-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-8-2-chemistry-chemical-reactions-periodic-table';
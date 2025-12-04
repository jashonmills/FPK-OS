-- Insert or update Science 6.2: Life Science - Cells, Ecosystems & Classification course
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
  'science-6-2-life-science-cells-ecosystems-classification',
  'science-6-2-life-science-cells-ecosystems-classification',
  'Science 6.2: Life Science - Cells, Ecosystems & Classification',
  'Dive into the world of living things, from the smallest building blocks of life to the complex interactions within ecosystems.',
  '/course-images/science-6-2-life-science-cells-ecosystems-classification-bg.jpg',
  '/course-images/science-6-2-life-science-cells-ecosystems-classification-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'science-6-2-life-science-cells-ecosystems-classification';
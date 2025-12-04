-- Insert or update ELA 8.3: Advanced Grammar & Composition course
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
  'ela-8-3-advanced-grammar-composition',
  'ela-8-3-advanced-grammar-composition',
  'ELA 8.3: Advanced Grammar & Composition',
  'Move beyond the basics to master the sophisticated grammar and stylistic techniques that create clear, powerful, and elegant writing.',
  '/course-images/ela-8-3-advanced-grammar-composition-bg.jpg',
  '/course-images/ela-8-3-advanced-grammar-composition-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'ela-8-3-advanced-grammar-composition';
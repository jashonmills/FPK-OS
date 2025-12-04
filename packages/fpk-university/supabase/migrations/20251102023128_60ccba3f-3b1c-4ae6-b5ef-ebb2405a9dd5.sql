-- Insert or update Math 7.2: Geometry - Angles, Area, Volume & Scale course
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
  'math-7-2-geometry-angles-area-volume-scale',
  'math-7-2-geometry-angles-area-volume-scale',
  'Math 7.2: Geometry - Angles, Area, Volume & Scale',
  'Explore the world of shapes and space by mastering angles, calculating area and volume, and working with scale drawings.',
  '/course-images/math-7-2-geometry-angles-area-volume-scale-bg.jpg',
  '/course-images/math-7-2-geometry-angles-area-volume-scale-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'math-7-2-geometry-angles-area-volume-scale';
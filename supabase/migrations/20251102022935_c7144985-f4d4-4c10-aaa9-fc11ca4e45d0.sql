-- Insert or update Math 7.1: Expressions, Equations & Inequalities course
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
  'math-7-1-expressions-equations-inequalities',
  'math-7-1-expressions-equations-inequalities',
  'Math 7.1: Expressions, Equations & Inequalities',
  'Master the foundational language of algebra by learning to write, interpret, and solve expressions, equations, and inequalities.',
  '/course-images/math-7-1-expressions-equations-inequalities-bg.jpg',
  '/course-images/math-7-1-expressions-equations-inequalities-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'math-7-1-expressions-equations-inequalities';
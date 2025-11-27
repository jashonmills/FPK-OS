-- Insert or update Math 7.3: Probability & Statistics course
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
  'math-7-3-probability-statistics',
  'math-7-3-probability-statistics',
  'Math 7.3: Probability & Statistics',
  'Learn to analyze data, understand the likelihood of events, and make predictions about the world using the tools of probability and statistics.',
  '/course-images/math-7-3-probability-statistics-bg.jpg',
  '/course-images/math-7-3-probability-statistics-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'math-7-3-probability-statistics';
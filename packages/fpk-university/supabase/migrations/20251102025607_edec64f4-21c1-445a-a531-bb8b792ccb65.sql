-- Insert or update Math 8.3: Data Analysis & Introduction to Algebra II course
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
  'math-8-3-data-analysis-intro-algebra-ii',
  'math-8-3-data-analysis-intro-algebra-ii',
  'Math 8.3: Data Analysis & Introduction to Algebra II',
  'Learn to interpret data using scatter plots and two-way tables, and get a first look at the advanced concepts of Algebra II.',
  '/course-images/math-8-3-data-analysis-intro-algebra-ii-bg.jpg',
  '/course-images/math-8-3-data-analysis-intro-algebra-ii-thumbnail.jpg',
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
DELETE FROM public.modules WHERE course_id = 'math-8-3-data-analysis-intro-algebra-ii';
-- Insert or update Introduction to Data Science course
INSERT INTO courses (
  id,
  slug,
  title,
  description,
  difficulty_level,
  duration_minutes,
  thumbnail_url,
  background_image,
  discoverable,
  tags,
  content_version,
  framework_type,
  status
) VALUES (
  gen_random_uuid()::text,
  'introduction-to-data-science',
  'Introduction to Data Science',
  'A forward-looking course that introduces the basics of data analysis, visualization, and interpretation using Python, preparing students for a data-driven world.',
  'beginner',
  600,
  '/course-images/introduction-to-data-science-thumbnail.jpg',
  '/course-images/introduction-to-data-science-bg.jpg',
  false,
  ARRAY['Data Science', 'Python', 'Analytics'],
  'v2',
  'sequential',
  'draft'
)
ON CONFLICT (slug) 
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty_level = EXCLUDED.difficulty_level,
  duration_minutes = EXCLUDED.duration_minutes,
  thumbnail_url = EXCLUDED.thumbnail_url,
  background_image = EXCLUDED.background_image,
  tags = EXCLUDED.tags,
  content_version = EXCLUDED.content_version,
  framework_type = EXCLUDED.framework_type,
  updated_at = now();
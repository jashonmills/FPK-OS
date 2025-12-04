-- Insert or update Creative Writing: Short Stories & Poetry course
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
  'creative-writing-short-stories-poetry',
  'Creative Writing: Short Stories & Poetry',
  'Unleash your inner author. This course provides the tools to craft compelling short stories and evocative poetry, focusing on character development, plot, imagery, and voice.',
  'beginner',
  420,
  '/course-images/creative-writing-short-stories-poetry-thumbnail.jpg',
  '/course-images/creative-writing-short-stories-poetry-bg.jpg',
  false,
  ARRAY['Creative Writing', 'Poetry', 'Short Stories', 'Writing'],
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
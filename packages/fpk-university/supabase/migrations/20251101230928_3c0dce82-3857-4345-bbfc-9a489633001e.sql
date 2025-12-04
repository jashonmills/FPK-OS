-- Insert or update U.S. History: Founding to Civil War course
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
  'us-history-founding-to-civil-war',
  'U.S. History: Founding to Civil War',
  'Journey through the birth of a nation, from the American Revolution and the creation of the Constitution to westward expansion and the crisis that led to the Civil War.',
  'beginner',
  540,
  '/course-images/us-history-founding-to-civil-war-thumbnail.jpg',
  '/course-images/us-history-founding-to-civil-war-bg.jpg',
  false,
  ARRAY['History', 'U.S. History', 'American Revolution', 'Constitution'],
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
-- Insert or update German for Beginners course
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
  'german-for-beginners-101',
  'German for Beginners (German 101)',
  'An interactive introduction to the German language and culture. This course builds a strong foundation in grammar, vocabulary, and conversation for beginners.',
  'beginner',
  540,
  '/course-images/german-for-beginners-101-thumbnail.jpg',
  '/course-images/german-for-beginners-101-bg.jpg',
  false,
  ARRAY['Language', 'German', 'Beginner'],
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
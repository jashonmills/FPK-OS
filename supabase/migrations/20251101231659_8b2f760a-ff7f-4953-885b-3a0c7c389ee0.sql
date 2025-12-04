-- Insert or update Chemistry: The Central Science course
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
  'chemistry-the-central-science',
  'Chemistry: The Central Science',
  'An interactive course exploring the composition, structure, and properties of matter. Covers the periodic table, chemical reactions, and the principles that govern the material world.',
  'beginner',
  720,
  '/course-images/chemistry-the-central-science-thumbnail.jpg',
  '/course-images/chemistry-the-central-science-bg.jpg',
  false,
  ARRAY['Chemistry', 'Science', 'STEM', 'Periodic Table'],
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
-- Add Music Theory Fundamentals course to database
INSERT INTO courses (
  id,
  slug,
  title,
  description,
  status,
  published_at,
  framework_type,
  content_version,
  difficulty_level,
  duration_minutes,
  background_image,
  thumbnail_url,
  tags
) VALUES (
  'music-theory-fundamentals',
  'music-theory-fundamentals',
  'Music Theory Fundamentals',
  'Learn the language of music. This course covers the essential building blocks of music, including reading sheet music, understanding scales, chords, and rhythm.',
  'draft',
  NULL,
  'sequential',
  'v2',
  'Beginner',
  480,
  '/course-images/music-theory-fundamentals-bg.jpg',
  '/course-images/music-theory-fundamentals-thumbnail.jpg',
  ARRAY['Arts', 'Music', 'Theory']
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  framework_type = EXCLUDED.framework_type,
  content_version = EXCLUDED.content_version,
  background_image = EXCLUDED.background_image,
  thumbnail_url = EXCLUDED.thumbnail_url,
  tags = EXCLUDED.tags;
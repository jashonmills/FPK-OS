-- Create or update Irish History course
INSERT INTO courses (
  id,
  slug,
  title,
  description,
  status,
  framework_type,
  content_version,
  thumbnail_url,
  background_image,
  duration_minutes,
  instructor_name,
  difficulty_level,
  course_visibility,
  featured
)
VALUES (
  'irish-history-union-to-famine',
  'irish-history-union-to-famine',
  'Irish History: From the Union to the Great Famine',
  'Discover a pivotal century in Irish history, from the loss of its parliament and the rise of Daniel O''Connell to the catastrophic Great Famine that changed Ireland forever.',
  'published',
  'sequential',
  'v2',
  '/course-images/irish-history-union-to-famine-thumb.jpg',
  '/course-images/irish-history-union-to-famine-hero.jpg',
  540,
  'FPK University',
  'intermediate',
  'global',
  false
)
ON CONFLICT (id) 
DO UPDATE SET
  status = 'published',
  framework_type = 'sequential',
  content_version = 'v2',
  thumbnail_url = '/course-images/irish-history-union-to-famine-thumb.jpg',
  background_image = '/course-images/irish-history-union-to-famine-hero.jpg',
  duration_minutes = 540,
  difficulty_level = 'intermediate',
  updated_at = now();
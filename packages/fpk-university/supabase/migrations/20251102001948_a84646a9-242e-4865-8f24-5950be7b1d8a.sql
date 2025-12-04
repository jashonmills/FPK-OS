-- Update AP U.S. History course to published with images
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
  'ap-us-history',
  'ap-us-history',
  'AP U.S. History',
  'A comprehensive college-level survey of American history from 1491 to the present. Aligned with the AP curriculum, this course emphasizes historical thinking skills and prepares students for the AP exam.',
  'published',
  'sequential',
  'v2',
  '/course-images/ap-us-history-thumb.jpg',
  '/course-images/ap-us-history-hero.jpg',
  1080,
  'FPK University',
  'advanced',
  'global',
  true
)
ON CONFLICT (id) 
DO UPDATE SET
  status = 'published',
  framework_type = 'sequential',
  content_version = 'v2',
  thumbnail_url = '/course-images/ap-us-history-thumb.jpg',
  background_image = '/course-images/ap-us-history-hero.jpg',
  duration_minutes = 1080,
  difficulty_level = 'advanced',
  featured = true,
  updated_at = now();
-- Update U.S. Government & Civics course to published with images
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
  'us-government-and-civics',
  'us-government-and-civics',
  'U.S. Government & Civics',
  'An essential guide to the structure and function of the United States government, the rights and responsibilities of citizenship, and the role of citizens in a democracy.',
  'published',
  'sequential',
  'v2',
  '/course-images/us-government-and-civics-thumb.jpg',
  '/course-images/us-government-and-civics-hero.jpg',
  480,
  'FPK University',
  'beginner',
  'global',
  true
)
ON CONFLICT (id) 
DO UPDATE SET
  status = 'published',
  framework_type = 'sequential',
  content_version = 'v2',
  thumbnail_url = '/course-images/us-government-and-civics-thumb.jpg',
  background_image = '/course-images/us-government-and-civics-hero.jpg',
  duration_minutes = 480,
  difficulty_level = 'beginner',
  featured = true,
  updated_at = now();
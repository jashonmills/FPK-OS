-- Update Irish Government & Civics course to published with images
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
  'irish-government-and-civics',
  'irish-government-and-civics',
  'Irish Government & Civics: Understanding the Republic',
  'An essential guide to the Irish political system. Explore the Oireachtas, the Taoiseach, the President, and discover your rights and responsibilities as an Irish and EU citizen.',
  'published',
  'sequential',
  'v2',
  '/course-images/irish-government-and-civics-thumb.jpg',
  '/course-images/irish-government-and-civics-hero.jpg',
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
  thumbnail_url = '/course-images/irish-government-and-civics-thumb.jpg',
  background_image = '/course-images/irish-government-and-civics-hero.jpg',
  duration_minutes = 480,
  difficulty_level = 'beginner',
  featured = true,
  updated_at = now();
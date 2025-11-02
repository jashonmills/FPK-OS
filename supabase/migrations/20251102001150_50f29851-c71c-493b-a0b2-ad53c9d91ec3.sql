-- Update Earth Science course to published status with images
UPDATE courses 
SET 
  status = 'published',
  framework_type = 'sequential',
  content_version = 'v2',
  thumbnail_url = '/course-images/earth-science-our-planet-in-space-thumb.jpg',
  background_image = '/course-images/earth-science-our-planet-in-space-hero.jpg',
  duration_minutes = 540,
  updated_at = now()
WHERE slug = 'earth-science-our-planet-in-space'
  OR id = 'earth-science-our-planet-in-space';

-- If the course doesn't exist yet, create it
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
SELECT 
  'earth-science-our-planet-in-space',
  'earth-science-our-planet-in-space',
  'Earth Science: Our Planet in Space',
  'A comprehensive overview of our planet and its place in the universe, covering geology, meteorology, oceanography, and astronomy.',
  'published',
  'sequential',
  'v2',
  '/course-images/earth-science-our-planet-in-space-thumb.jpg',
  '/course-images/earth-science-our-planet-in-space-hero.jpg',
  540,
  'FPK University',
  'beginner',
  'global',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM courses WHERE slug = 'earth-science-our-planet-in-space' OR id = 'earth-science-our-planet-in-space'
);
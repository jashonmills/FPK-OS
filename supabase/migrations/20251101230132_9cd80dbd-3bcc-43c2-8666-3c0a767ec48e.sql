-- Insert or update Cybersecurity Fundamentals course
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
  'cybersecurity-fundamentals',
  'Cybersecurity Fundamentals',
  'Learn how to protect yourself and others in the digital world. This course covers common threats like phishing and malware and teaches the essential principles of online safety.',
  'beginner',
  480,
  '/course-images/cybersecurity-fundamentals-thumbnail.jpg',
  '/course-images/cybersecurity-fundamentals-bg.jpg',
  false,
  ARRAY['Technology', 'Security', 'Privacy'],
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
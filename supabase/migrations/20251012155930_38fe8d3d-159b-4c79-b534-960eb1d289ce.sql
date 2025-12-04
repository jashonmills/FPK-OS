-- Add Introduction to Video Production course to courses table
INSERT INTO courses (
  id,
  title,
  description,
  slug,
  status,
  instructor_name,
  duration_minutes,
  difficulty_level,
  thumbnail_url,
  featured,
  is_free,
  course_visibility
) VALUES (
  'introduction-video-production',
  'Introduction to Video Production',
  'Learn the fundamentals of video production from start to finish in this introductory lesson.',
  'introduction-video-production',
  'published',
  'FPK University',
  20,
  'beginner',
  'https://i.vimeocdn.com/video/1596743275-b4263b12c58916c739173b84e4510b423985312d41872956a59ed7a551989569-d_1920x1080',
  false,
  true,
  'global'
) ON CONFLICT (id) DO NOTHING;
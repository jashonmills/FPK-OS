-- Insert EL Spelling course with correct column names
INSERT INTO public.courses (
  id,
  title,
  slug,
  description,
  duration_minutes,
  difficulty_level,
  thumbnail_url,
  framework_type,
  content_version,
  status,
  featured,
  discoverable,
  created_at,
  updated_at
) VALUES (
  'el-spelling',
  'EL Spelling',
  'el-spelling',
  'Master spelling and reading through visual memory techniques and optimal learning methods. Learn to spell any word using proven visual learning techniques.',
  120,
  'Beginner',
  'https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/course-images/el-spelling-thumbnail.png',
  'sequential',
  'v2',
  'published',
  true,
  true,
  NOW(),
  NOW()
);
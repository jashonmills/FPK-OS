-- Insert EL Spelling & Reading course
INSERT INTO public.courses (
  id,
  title,
  description,
  difficulty_level,
  status,
  featured,
  is_free,
  duration_minutes,
  instructor_name,
  tags
) VALUES (
  'el-spelling-reading',
  'EL Spelling & Reading',
  'Comprehensive English Language spelling and reading program designed to improve literacy skills through interactive lessons and exercises.',
  'beginner',
  'published',
  true,
  true,
  240,
  'Dr. Sarah Martinez',
  ARRAY['English Learning', 'Literacy', 'Spelling', 'Reading', 'Elementary']
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty_level = EXCLUDED.difficulty_level,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  is_free = EXCLUDED.is_free,
  duration_minutes = EXCLUDED.duration_minutes,
  instructor_name = EXCLUDED.instructor_name,
  tags = EXCLUDED.tags,
  updated_at = now();
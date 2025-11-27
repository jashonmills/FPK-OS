-- Add ELT: Empowering Learning Techniques course to the courses table
INSERT INTO public.courses (
  id, 
  title, 
  description, 
  instructor_name, 
  duration_minutes, 
  difficulty_level, 
  status,
  created_at,
  updated_at
) VALUES (
  'elt-empowering-learning-techniques',
  'ELT: Empowering Learning Techniques',
  'Master evidence-based learning strategies specifically designed for neurodiverse minds. Transform how you learn, study, and succeed in any academic environment.',
  'FPK University',
  240,
  'beginner',
  'published',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  instructor_name = EXCLUDED.instructor_name,
  duration_minutes = EXCLUDED.duration_minutes,
  difficulty_level = EXCLUDED.difficulty_level,
  status = EXCLUDED.status,
  updated_at = now();
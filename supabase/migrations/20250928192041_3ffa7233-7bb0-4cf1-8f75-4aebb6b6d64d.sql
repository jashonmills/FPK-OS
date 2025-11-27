-- Add the EL Handwriting course to the courses table
INSERT INTO courses (
  id,
  title,
  description,
  instructor_name,
  duration_minutes,
  difficulty_level,
  featured,
  is_free,
  price,
  tags,
  thumbnail_url,
  status
) VALUES (
  'el-handwriting',
  'EL Handwriting', 
  'Master handwriting through visual emulation techniques and optimal learning states. Includes deep dive modules exploring the neuroscience behind handwriting development.',
  'FPK University',
  240,
  'beginner',
  true,
  true,
  0,
  ARRAY['Writing Skills', 'Handwriting', 'Emulation Technique', 'Visual Learning', 'Neuroscience'],
  'el-handwriting-bg.jpg',
  'published'
) ON CONFLICT (id) DO NOTHING;
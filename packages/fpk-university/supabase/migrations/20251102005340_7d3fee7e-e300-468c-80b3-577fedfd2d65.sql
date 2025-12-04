-- Insert Physics: Motion, Energy, and Matter course
INSERT INTO public.courses (
  id,
  title,
  slug,
  description,
  difficulty_level,
  duration_minutes,
  status,
  framework_type,
  content_version,
  background_image,
  discoverable,
  is_free,
  created_at,
  updated_at
) VALUES (
  'physics-motion-energy-matter',
  'Physics: Motion, Energy, and Matter',
  'physics-motion-energy-matter',
  'Explore the fundamental laws that govern the universe. From the motion of planets to the flow of electricity, this interactive course makes physics accessible and exciting.',
  'intermediate',
  720,
  'published',
  'sequential',
  'v2',
  '/lovable-uploads/physics-motion-energy-bg.jpg',
  true,
  true,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  status = EXCLUDED.status,
  updated_at = now();
-- Create the Empowering Learning for Spelling course
INSERT INTO public.native_courses (
  title, 
  slug, 
  summary, 
  est_minutes, 
  cover_url, 
  visibility, 
  course_visibility,
  created_by
) VALUES (
  'Empowering Learning for Spelling',
  'empowering-learning-spelling',
  'Master spelling through visual memory techniques and optimal learning states. A comprehensive program designed for visual learners to overcome spelling challenges.',
  120,
  '/src/assets/empowering-learning-spelling-hero.jpg',
  'published',
  'global',
  '00000000-0000-0000-0000-000000000000'::uuid
);
-- Create the Extended version as a NEW course (keep student enrollments on the basic version)
INSERT INTO public.courses (
  id,
  slug,
  title,
  description,
  background_image,
  thumbnail_url,
  framework_type,
  content_version,
  status,
  discoverable,
  duration_minutes,
  difficulty_level
) VALUES (
  'empowering-learning-numeracy-extended',
  'empowering-learning-numeracy-extended',
  'Empowering Learning: Numeracy (Extended)',
  'Master mathematics through visual memory techniques and number triangles - Extended version with deep dives and assessments. Includes 12 comprehensive lessons covering core concepts, advanced theory, and knowledge tests.',
  '/course-images/empowering-learning-numeracy-extended-bg.jpg',
  '/course-images/empowering-learning-numeracy-extended-thumbnail.jpg',
  'sequential',
  'v2',
  'published',
  true,
  120,
  'intermediate'
);

-- Update the existing basic course (students stay enrolled here)
UPDATE public.courses
SET 
  title = 'Empowering Learning: Numeracy',
  description = 'Master mathematics through visual memory techniques and number triangles. Learn addition, subtraction, multiplication and division using proven visual learning methods. (Basic 5-lesson version)',
  duration_minutes = 45,
  difficulty_level = 'introductory'
WHERE id = 'empowering-learning-numeracy';
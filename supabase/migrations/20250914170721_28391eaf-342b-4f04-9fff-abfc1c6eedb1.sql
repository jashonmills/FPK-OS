-- Insert hardcoded interactive courses into the courses table
-- This allows users to enroll in these courses through the standard enrollment system

INSERT INTO public.courses (
  id, 
  title, 
  description, 
  difficulty_level, 
  duration_minutes, 
  instructor_name, 
  featured, 
  status,
  slug,
  created_at,
  updated_at
) VALUES 
(
  'interactive-linear-equations',
  'Interactive Linear Equations',
  'Master solving linear equations through interactive lessons and practice problems. Learn step-by-step problem solving with immediate feedback.',
  'beginner',
  240,
  'FPK University',
  true,
  'published',
  'interactive-linear-equations',
  now(),
  now()
),
(
  'interactive-trigonometry', 
  'Interactive Trigonometry',
  'Master trigonometry through interactive lessons, visual demonstrations, and practical applications. From basic SOHCAHTOA to complex real-world problem solving.',
  'intermediate', 
  300,
  'FPK University',
  true,
  'published', 
  'interactive-trigonometry',
  now(),
  now()
),
(
  'interactive-algebra',
  'Interactive Algebra', 
  'Master algebra fundamentals through interactive lessons and practice problems. Learn algebraic expressions, equations, and problem-solving techniques.',
  'beginner',
  320,
  'FPK University', 
  true,
  'published',
  'interactive-algebra', 
  now(),
  now()
),
(
  'logic-critical-thinking',
  'Logic and Critical Thinking',
  'Develop essential reasoning skills through systematic study of logic and critical thinking. Learn to analyze arguments, identify fallacies, and construct sound reasoning.',
  'beginner',
  400,
  'FPK University',
  true, 
  'published',
  'logic-critical-thinking',
  now(),
  now()
),
(
  'introduction-modern-economics',
  'Introduction to Modern Economics',
  'Master the fundamental principles of economics, from basic supply and demand to complex macroeconomic policies.',
  'beginner',
  600,
  'FPK University',
  true,
  'published',
  'introduction-modern-economics',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty_level = EXCLUDED.difficulty_level,
  duration_minutes = EXCLUDED.duration_minutes,
  instructor_name = EXCLUDED.instructor_name,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status,
  slug = EXCLUDED.slug,
  updated_at = now();
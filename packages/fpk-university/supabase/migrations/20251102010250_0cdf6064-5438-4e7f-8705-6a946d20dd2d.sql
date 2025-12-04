-- Insert modules for Physics: Motion, Energy, and Matter course
INSERT INTO public.modules (
  course_id,
  module_number,
  title,
  description,
  content_type,
  duration_minutes,
  is_published,
  sort_order
) VALUES
  -- Lesson 1
  ('physics-motion-energy-matter', 1, 'Newton''s Laws of Motion', 'Define Newton''s Three Laws of Motion and understand inertia, force, mass, and acceleration', 'text', 25, true, 1),
  -- Lesson 2
  ('physics-motion-energy-matter', 2, 'Gravity and Work', 'Understand gravity as a fundamental force and learn the physics definition of work', 'text', 20, true, 2),
  -- Lesson 3
  ('physics-motion-energy-matter', 3, 'Energy - Kinetic and Potential', 'Learn about kinetic energy, potential energy, and the Law of Conservation of Energy', 'text', 20, true, 3),
  -- Lesson 4
  ('physics-motion-energy-matter', 4, 'Heat and Thermodynamics', 'Explore heat transfer, the Laws of Thermodynamics, and methods of thermal energy transfer', 'text', 25, true, 4),
  -- Lesson 5
  ('physics-motion-energy-matter', 5, 'Electricity', 'Learn about electric charge, current, circuits, and Ohm''s Law', 'text', 25, true, 5),
  -- Lesson 6
  ('physics-motion-energy-matter', 6, 'Magnetism and Electromagnetism', 'Discover how electricity and magnetism are connected through electromagnetism', 'text', 25, true, 6)
ON CONFLICT (course_id, module_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  is_published = EXCLUDED.is_published;
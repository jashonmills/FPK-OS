-- Insert the two new courses into the courses table if they don't exist
INSERT INTO courses (id, title, description, featured, thumbnail_url, created_at, updated_at)
VALUES 
  (
    'empowering-learning-reading',
    'Empowering Learning for Reading',
    'Master reading through visual memory techniques and optimal learning states. A comprehensive program designed for visual learners to overcome reading challenges.',
    true,
    null,
    NOW(),
    NOW()
  ),
  (
    'empowering-learning-numeracy', 
    'Empowering Learning for Numeracy',
    'Master mathematics through visual memory techniques and number triangles. Learn addition, subtraction, multiplication and division using proven visual learning methods.',
    true,
    null,
    NOW(), 
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();
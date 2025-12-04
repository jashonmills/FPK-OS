-- Create all 9 lessons for the Economics course
INSERT INTO course_lessons (module_id, title, order_index, est_minutes, created_at, updated_at)
WITH module_mapping AS (
  SELECT 
    cm.id as module_id,
    cm.title as module_title
  FROM course_modules cm
  JOIN native_courses nc ON nc.id = cm.course_id
  WHERE nc.slug = 'introduction-modern-economics'
)
SELECT 
  mm.module_id,
  lesson_info.title,
  lesson_info.order_idx,
  lesson_info.minutes,
  now(),
  now()
FROM module_mapping mm
JOIN (VALUES 
  ('Unit 1: The Core Principles & Economic Thought', 'The Economic Way of Thinking', 1, 60),
  ('Unit 1: The Core Principles & Economic Thought', 'Economic Systems and the Role of Money', 2, 45),
  ('Unit 2: Supply & Demand: The Market Engine', 'The Laws of Supply and Demand', 1, 50),
  ('Unit 2: Supply & Demand: The Market Engine', 'Shifting Markets and Visualizing Change', 2, 55),
  ('Unit 3: Microeconomics vs. Macroeconomics', 'Understanding the Two Branches', 1, 40),
  ('Unit 3: Microeconomics vs. Macroeconomics', 'Macroeconomic Indicators and Policy', 2, 65),
  ('Unit 4: Modern Topics for the 21st Century Economist', 'Behavioral Economics: Why We Don''t Always Act Rationally', 1, 55),
  ('Unit 4: Modern Topics for the 21st Century Economist', 'Climate Economics and Policy', 2, 60),
  ('Unit 4: Modern Topics for the 21st Century Economist', 'The Economics of Cryptocurrency', 3, 50)
) AS lesson_info(module_title, title, order_idx, minutes) ON mm.module_title = lesson_info.module_title;
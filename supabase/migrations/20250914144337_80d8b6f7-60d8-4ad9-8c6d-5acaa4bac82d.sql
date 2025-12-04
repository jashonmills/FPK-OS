-- Create the 4 course modules for the Economics course
INSERT INTO course_modules (course_id, title, order_index, created_at, updated_at)
SELECT 
  (SELECT id FROM native_courses WHERE slug = 'introduction-modern-economics'),
  module_title,
  module_order,
  now(),
  now()
FROM (VALUES 
  ('Unit 1: The Core Principles & Economic Thought', 1),
  ('Unit 2: Supply & Demand: The Market Engine', 2),
  ('Unit 3: Microeconomics vs. Macroeconomics', 3),
  ('Unit 4: Modern Topics for the 21st Century Economist', 4)
) AS modules(module_title, module_order);
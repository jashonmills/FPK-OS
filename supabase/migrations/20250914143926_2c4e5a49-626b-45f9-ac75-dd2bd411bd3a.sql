-- Create the main Economics course
INSERT INTO native_courses (id, title, slug, summary, est_minutes, cover_url, visibility, course_visibility, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Introduction to Modern Economics: Full Course Curriculum',
  'introduction-modern-economics',
  'This course provides students with a foundational understanding of economic principles by empowering them to "think like an economist." It moves beyond abstract theories, focusing on real-world applications and interactive learning to analyze the world around them.',
  480,
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZWNvbkdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjU2M0VCO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxRDRFRDg7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNlY29uR3JhZCkiIHJ4PSI4IiAvPgogIDxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIyNjAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgcng9IjQiIC8+CiAgPHRleHQgeD0iMjAwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9ImJvbGQiIAogICAgICAgIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IndoaXRlIj5Nb2Rlcm4gRWNvbm9taWNzPC90ZXh0PgogIDx0ZXh0IHg9IjIwMCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIAogICAgICAgIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44KSI+RnVsbCBDb3Vyc2UgQ3VycmljdWx1bTwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiAKICAgICAgICB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNikiPjkgSW50ZXJhY3RpdmUgTGVzc29uczwvdGV4dD4KICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSIyNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiAvPgogIDxjaXJjbGUgY3g9IjM0MCIgY3k9IjI0MCIgcj0iMjAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIgLz4KICA8cGF0aCBkPSJNODAgMjIwIEwxMjAgMjQwIEwxNjAgMjIwIEwyMDAgMjUwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiAvPgo8L3N2Zz4K',
  'published',
  'global',
  now(),
  now()
);

-- Get the course ID to use for modules
WITH course_data AS (
  SELECT id as course_id FROM native_courses WHERE slug = 'introduction-modern-economics'
)

-- Create the 4 course modules
, module_inserts AS (
  INSERT INTO course_modules (id, course_id, title, order_index, created_at, updated_at)
  SELECT 
    gen_random_uuid(),
    course_data.course_id,
    module_title,
    module_order
  FROM course_data,
  (VALUES 
    ('Unit 1: The Core Principles & Economic Thought', 1),
    ('Unit 2: Supply & Demand: The Market Engine', 2),
    ('Unit 3: Microeconomics vs. Macroeconomics', 3),
    ('Unit 4: Modern Topics for the 21st Century Economist', 4)
  ) AS modules(module_title, module_order)
  RETURNING id, title, order_index
)

-- Create all 9 lessons
, lesson_data AS (
  SELECT 
    module_id,
    lesson_title,
    lesson_order,
    est_min
  FROM (
    SELECT 
      m.id as module_id,
      lesson_info.title as lesson_title,
      lesson_info.order_idx as lesson_order,
      lesson_info.minutes as est_min
    FROM module_inserts m
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
    ) AS lesson_info(module_title, title, order_idx, minutes) ON m.title = lesson_info.module_title
  ) lesson_mapping
)

INSERT INTO course_lessons (id, module_id, title, order_index, est_minutes, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  module_id,
  lesson_title,
  lesson_order,
  est_min,
  now(),
  now()
FROM lesson_data;
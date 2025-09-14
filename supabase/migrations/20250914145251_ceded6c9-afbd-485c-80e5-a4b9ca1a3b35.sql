-- Create quiz items for Lesson 1 quizzes with proper JSON casting
-- First, get the quiz block IDs for lesson 1
WITH quiz_blocks AS (
  SELECT id, order_index, data_json
  FROM lesson_blocks 
  WHERE lesson_id = '348c792e-9c44-474c-98d0-c2e80c3d23c2' 
  AND type = 'quiz'
)

-- Insert quiz items for the first quiz (Quick Check: Opportunity Cost)
INSERT INTO quiz_items (block_id, kind, prompt, options_json, answer_key_json, points, order_index, created_at) 
SELECT 
  (SELECT id FROM quiz_blocks WHERE order_index = 4),
  'mcq',
  'What is opportunity cost?',
  '[
    {"text": "The monetary cost of a good or service", "id": "a"},
    {"text": "The foregone benefit of the next best alternative when a choice is made", "id": "b"},
    {"text": "The total cost of all options available", "id": "c"},
    {"text": "The cost of the most expensive option", "id": "d"}
  ]'::jsonb,
  '{"correct_answer": "b", "explanation": "Opportunity cost is specifically the foregone benefit of the next best alternative - what you give up when you make a choice."}'::jsonb,
  10,
  1,
  now()

UNION ALL SELECT 
  (SELECT id FROM quiz_blocks WHERE order_index = 4),
  'mcq',
  'If you choose to spend an evening studying economics instead of working at your part-time job where you earn €12/hour, and you study for 3 hours, what is your opportunity cost?',
  '[
    {"text": "€0, because studying is free", "id": "a"},
    {"text": "€36 in potential wages", "id": "b"},
    {"text": "The cost of your textbooks", "id": "c"},
    {"text": "€12", "id": "d"}
  ]'::jsonb,
  '{"correct_answer": "b", "explanation": "3 hours × €12/hour = €36 in foregone wages. This is what you gave up to study."}'::jsonb,
  10,
  2,
  now()

UNION ALL SELECT 
  (SELECT id FROM quiz_blocks WHERE order_index = 9),
  'mcq',
  'Which point on a Production Possibilities Curve represents economic efficiency?',
  '[
    {"text": "Points inside the curve", "id": "a"},
    {"text": "Points on the curve", "id": "b"},
    {"text": "Points outside the curve", "id": "c"},
    {"text": "Only the midpoint of the curve", "id": "d"}
  ]'::jsonb,
  '{"correct_answer": "b", "explanation": "Points on the PPC represent efficiency because all resources are being used optimally to produce the maximum possible output."}'::jsonb,
  10,
  1,
  now()

UNION ALL SELECT 
  (SELECT id FROM quiz_blocks WHERE order_index = 9),
  'multi',
  'Which of the following are key characteristics of rational decision-making in economics? (Select all that apply)',
  '[
    {"text": "Comparing marginal benefits to marginal costs", "id": "a"},
    {"text": "Making decisions based purely on emotions", "id": "b"},
    {"text": "Considering opportunity costs", "id": "c"},
    {"text": "Always choosing the most expensive option", "id": "d"},
    {"text": "Thinking at the margin", "id": "e"}
  ]'::jsonb,
  '{"correct_answers": ["a", "c", "e"], "explanation": "Rational decision-making involves comparing marginal benefits to costs, considering opportunity costs, and thinking at the margin about additional units."}'::jsonb,
  15,
  2,
  now()

UNION ALL SELECT 
  (SELECT id FROM quiz_blocks WHERE order_index = 9),
  'mcq',
  'Why are property rights important for economic growth?',
  '[
    {"text": "They make lawyers wealthy", "id": "a"},
    {"text": "They provide incentives for people to invest, save, and be productive", "id": "b"},
    {"text": "They prevent people from owning anything", "id": "c"},
    {"text": "They only benefit the government", "id": "d"}
  ]'::jsonb,
  '{"correct_answer": "b", "explanation": "Secure property rights give people confidence that they can keep the benefits of their investments and hard work, encouraging economic activity."}'::jsonb,
  10,
  3,
  now();
-- Create quiz items for Lesson 2: Economic Systems and Money
INSERT INTO quiz_items (block_id, kind, prompt, options_json, answer_key_json, points, order_index, created_at) 
VALUES 

-- Quiz questions for Lesson 2 (Economic Systems and Money)
((SELECT id FROM lesson_blocks WHERE lesson_id = 'afda7193-f388-48df-8658-39b669921255' AND type = 'quiz' AND order_index = 7), 
 'mcq', 
 'Which type of economic system does Ireland have?',
 '[
   {"text": "Pure market economy", "id": "a"},
   {"text": "Command economy", "id": "b"},
   {"text": "Mixed economy", "id": "c"},
   {"text": "Traditional economy", "id": "d"}
 ]'::jsonb,
 '{"correct_answer": "c", "explanation": "Ireland has a mixed economy that combines market mechanisms with government intervention through the HSE, social welfare, and semi-state bodies."}'::jsonb,
 10, 1, now()),

((SELECT id FROM lesson_blocks WHERE lesson_id = 'afda7193-f388-48df-8658-39b669921255' AND type = 'quiz' AND order_index = 7), 
 'multi', 
 'Which of the following are functions of money? (Select all that apply)',
 '[
   {"text": "Medium of exchange", "id": "a"},
   {"text": "Source of happiness", "id": "b"},
   {"text": "Unit of account", "id": "c"},
   {"text": "Store of value", "id": "d"},
   {"text": "Symbol of status only", "id": "e"}
 ]'::jsonb,
 '{"correct_answers": ["a", "c", "d"], "explanation": "Money serves as a medium of exchange (for transactions), unit of account (measuring value), and store of value (saving purchasing power)."}'::jsonb,
 15, 2, now()),

((SELECT id FROM lesson_blocks WHERE lesson_id = 'afda7193-f388-48df-8658-39b669921255' AND type = 'quiz' AND order_index = 7), 
 'mcq', 
 'Why is bartering (trading goods directly) less efficient than using money?',
 '[
   {"text": "Bartering is actually more efficient than money", "id": "a"},
   {"text": "It requires a double coincidence of wants", "id": "b"},
   {"text": "People don''t like to trade", "id": "c"},
   {"text": "Goods cannot be exchanged for other goods", "id": "d"}
 ]'::jsonb,
 '{"correct_answer": "b", "explanation": "Bartering requires finding someone who has what you want AND wants what you have - a double coincidence of wants that is hard to achieve."}'::jsonb,
 10, 3, now());
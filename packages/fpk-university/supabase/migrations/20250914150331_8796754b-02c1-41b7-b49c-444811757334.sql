-- Create quiz block for Behavioral Economics lesson and add quiz questions
-- First, create the quiz block
INSERT INTO lesson_blocks (lesson_id, type, title, content, order_index, created_at, updated_at)
VALUES 
('ff2eae67-4334-4a7c-9a83-350de3c22cb5', 'quiz', 'Quiz: Behavioral Economics', '{"instructions": "Test your understanding of behavioral economics concepts and their real-world applications."}'::jsonb, 8, now(), now());

-- Now add quiz questions for the Behavioral Economics lesson
INSERT INTO quiz_items (block_id, kind, prompt, options_json, answer_key_json, points, order_index, created_at) 
VALUES 
-- Get the block_id for the quiz block we just created
((SELECT id FROM lesson_blocks WHERE lesson_id = 'ff2eae67-4334-4a7c-9a83-350de3c22cb5' AND type = 'quiz' AND order_index = 8), 
 'mcq', 
 'What is present bias in behavioral economics?',
 '[
   {"text": "Preferring current rewards over future ones", "id": "a"},
   {"text": "Being biased against the present", "id": "b"},
   {"text": "Only caring about future outcomes", "id": "c"},
   {"text": "Having no time preferences", "id": "d"}
 ]'::jsonb,
 '{"correct_answer": "a", "explanation": "Present bias is the tendency to overvalue immediate rewards compared to future benefits, leading to decisions like choosing €50 today over €100 in a year."}'::jsonb,
 10, 1, now()),

((SELECT id FROM lesson_blocks WHERE lesson_id = 'ff2eae67-4334-4a7c-9a83-350de3c22cb5' AND type = 'quiz' AND order_index = 8), 
 'mcq', 
 'According to loss aversion, how do people typically react to losses compared to equivalent gains?',
 '[
   {"text": "They feel losses and gains equally", "id": "a"},
   {"text": "They feel losses about twice as strongly as gains", "id": "b"},
   {"text": "They feel gains more strongly than losses", "id": "c"},
   {"text": "They ignore both losses and gains", "id": "d"}
 ]'::jsonb,
 '{"correct_answer": "b", "explanation": "Loss aversion means people typically feel the pain of losing something about twice as strongly as the pleasure from gaining the same thing."}'::jsonb,
 10, 2, now()),

((SELECT id FROM lesson_blocks WHERE lesson_id = 'ff2eae67-4334-4a7c-9a83-350de3c22cb5' AND type = 'quiz' AND order_index = 8), 
 'multi', 
 'Which are examples of behavioral nudges in gaming? (Select all that apply)',
 '[
   {"text": "Making daily login the default option", "id": "a"},
   {"text": "Hiding all game features", "id": "b"},
   {"text": "Framing purchases as limited-time offers", "id": "c"},
   {"text": "Using loss aversion in \"you will lose your streak\"", "id": "d"},
   {"text": "Removing all game mechanics", "id": "e"}
 ]'::jsonb,
 '{"correct_answers": ["a", "c", "d"], "explanation": "Behavioral nudges in gaming include making engagement the default, using scarcity framing, and leveraging loss aversion with streak mechanics."}'::jsonb,
 15, 3, now());
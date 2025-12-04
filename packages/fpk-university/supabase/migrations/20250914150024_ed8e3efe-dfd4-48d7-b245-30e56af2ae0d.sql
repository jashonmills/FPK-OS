-- Create quiz items for Lesson 3: Laws of Supply and Demand
INSERT INTO quiz_items (block_id, kind, prompt, options_json, answer_key_json, points, order_index, created_at) 
VALUES 
-- Quiz questions for Lesson 3 (Laws of Supply and Demand)
((SELECT id FROM lesson_blocks WHERE lesson_id = '2f7a8b9c-3e4d-5f6a-7b8c-9d0e1f2a3b4c' AND type = 'quiz' AND order_index = 7), 
 'mcq', 
 'According to the Law of Demand, when the price of a good increases, what happens to quantity demanded?',
 '[
   {"text": "It increases", "id": "a"},
   {"text": "It decreases", "id": "b"},
   {"text": "It stays the same", "id": "c"},
   {"text": "It depends on the supply", "id": "d"}
 ]'::jsonb,
 '{"correct_answer": "b", "explanation": "The Law of Demand states that there is an inverse relationship between price and quantity demanded - when price goes up, demand goes down."}'::jsonb,
 10, 1, now()),

((SELECT id FROM lesson_blocks WHERE lesson_id = '2f7a8b9c-3e4d-5f6a-7b8c-9d0e1f2a3b4c' AND type = 'quiz' AND order_index = 7), 
 'mcq', 
 'In the Irish housing crisis example, what happens when demand for housing exceeds supply?',
 '[
   {"text": "Prices fall", "id": "a"},
   {"text": "Prices rise", "id": "b"},
   {"text": "Nothing changes", "id": "c"},
   {"text": "Supply automatically increases", "id": "d"}
 ]'::jsonb,
 '{"correct_answer": "b", "explanation": "When demand exceeds supply, there is upward pressure on prices, which is exactly what happened in the Irish housing market."}'::jsonb,
 10, 2, now()),

((SELECT id FROM lesson_blocks WHERE lesson_id = '2f7a8b9c-3e4d-5f6a-7b8c-9d0e1f2a3b4c' AND type = 'quiz' AND order_index = 7), 
 'multi', 
 'Which factors can shift the demand curve? (Select all that apply)',
 '[
   {"text": "Changes in consumer income", "id": "a"},
   {"text": "Changes in production costs", "id": "b"},
   {"text": "Changes in consumer preferences", "id": "c"},
   {"text": "Number of buyers in the market", "id": "d"},
   {"text": "Price of substitute goods", "id": "e"}
 ]'::jsonb,
 '{"correct_answers": ["a", "c", "d", "e"], "explanation": "Demand shifters include income, preferences, number of buyers, and substitute prices. Production costs affect supply, not demand."}'::jsonb,
 15, 3, now()),

-- Quiz questions for Lesson 4 (Behavioral Economics)
((SELECT id FROM lesson_blocks WHERE lesson_id = '4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f' AND type = 'quiz' AND order_index = 7), 
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

((SELECT id FROM lesson_blocks WHERE lesson_id = '4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f' AND type = 'quiz' AND order_index = 7), 
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

((SELECT id FROM lesson_blocks WHERE lesson_id = '4c5d6e7f-8a9b-0c1d-2e3f-4a5b6c7d8e9f' AND type = 'quiz' AND order_index = 7), 
 'multi', 
 'Which are examples of behavioral nudges in gaming? (Select all that apply)',
 '[
   {"text": "Making daily login the default option", "id": "a"},
   {"text": "Hiding all game features", "id": "b"},
   {"text": "Framing purchases as limited-time offers", "id": "c"},
   {"text": "Using loss aversion in ''you will lose your streak''", "id": "d"},
   {"text": "Removing all game mechanics", "id": "e"}
 ]'::jsonb,
 '{"correct_answers": ["a", "c", "d"], "explanation": "Behavioral nudges in gaming include making engagement the default, using scarcity framing, and leveraging loss aversion with streak mechanics."}'::jsonb,
 15, 3, now());
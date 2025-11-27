-- Create quiz items for existing quiz blocks
INSERT INTO quiz_items (block_id, kind, prompt, options_json, answer_key_json, points, order_index, created_at) 
VALUES 
-- Quiz questions for Lesson "The Laws of Supply and Demand" (block_id: 6742c10f-f7af-4d6c-8b41-15ee27ce2fbd)
('6742c10f-f7af-4d6c-8b41-15ee27ce2fbd', 
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

('6742c10f-f7af-4d6c-8b41-15ee27ce2fbd', 
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

('6742c10f-f7af-4d6c-8b41-15ee27ce2fbd', 
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
 15, 3, now());
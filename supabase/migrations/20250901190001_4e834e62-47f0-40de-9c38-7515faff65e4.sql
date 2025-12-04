-- Add sample content for the Algebra Pathfinder course
DO $$
DECLARE
    v_course_id UUID := '8ef71d5e-2770-41bc-bcc2-ce6343eb11bf';
    v_module1_id UUID := gen_random_uuid();
    v_module2_id UUID := gen_random_uuid();
    v_lesson1_id UUID := gen_random_uuid();
    v_lesson2_id UUID := gen_random_uuid();
    v_lesson3_id UUID := gen_random_uuid();
BEGIN
    -- Create modules
    INSERT INTO course_modules (id, course_id, title, order_index) VALUES
    (v_module1_id, v_course_id, 'Introduction to Algebra', 1),
    (v_module2_id, v_course_id, 'Simplifying Expressions', 2);
    
    -- Create lessons
    INSERT INTO course_lessons (id, module_id, title, order_index, est_minutes) VALUES
    (v_lesson1_id, v_module1_id, 'What is Algebra?', 1, 15),
    (v_lesson2_id, v_module1_id, 'Basic Algebraic Terms', 2, 20),
    (v_lesson3_id, v_module2_id, 'Combining Like Terms', 1, 25);
    
    -- Create lesson blocks with sample content
    INSERT INTO lesson_blocks (lesson_id, order_index, type, data_json) VALUES
    -- Lesson 1 blocks
    (v_lesson1_id, 1, 'rich-text', '{"content": "<h2>Welcome to Algebra!</h2><p>Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations.</p><p>In this lesson, you will learn:</p><ul><li>What algebra is and why it''s important</li><li>Basic algebraic concepts</li><li>How algebra relates to real-world problems</li></ul>"}'),
    (v_lesson1_id, 2, 'image', '{"src": "https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/algebra-cover.jpg", "alt": "Algebra concepts", "caption": "Algebra helps us solve real-world problems"}'),
    (v_lesson1_id, 3, 'quiz', '{"title": "Quick Check: Understanding Algebra", "description": "Test your understanding of basic algebra concepts"}'),
    
    -- Lesson 2 blocks
    (v_lesson2_id, 1, 'rich-text', '{"content": "<h2>Basic Algebraic Terms</h2><p>Before we dive deeper, let''s learn some key terms:</p><ul><li><strong>Variable</strong>: A letter that represents an unknown number (like x or y)</li><li><strong>Coefficient</strong>: The number in front of a variable (in 3x, the coefficient is 3)</li><li><strong>Constant</strong>: A number that doesn''t change (like 5 or -2)</li><li><strong>Expression</strong>: A combination of variables, coefficients, and constants</li></ul>"}'),
    (v_lesson2_id, 2, 'rich-text', '{"content": "<h3>Examples:</h3><p>In the expression <strong>3x + 5</strong>:</p><ul><li>3 is the coefficient</li><li>x is the variable</li><li>5 is the constant</li></ul>"}'),
    (v_lesson2_id, 3, 'quiz', '{"title": "Identify Algebraic Terms", "description": "Practice identifying coefficients, variables, and constants"}'),
    
    -- Lesson 3 blocks
    (v_lesson3_id, 1, 'rich-text', '{"content": "<h2>Combining Like Terms</h2><p>Like terms have the same variable raised to the same power. We can combine them by adding or subtracting their coefficients.</p><h3>Examples:</h3><ul><li>3x + 2x = 5x</li><li>7y - 3y = 4y</li><li>2a² + 5a² = 7a²</li></ul>"}'),
    (v_lesson3_id, 2, 'rich-text', '{"content": "<h3>Practice Problems:</h3><ol><li>Simplify: 4x + 3x</li><li>Simplify: 8y - 2y + y</li><li>Simplify: 3a² + 2a + 5a²</li></ol>"}'),
    (v_lesson3_id, 3, 'quiz', '{"title": "Combining Like Terms Practice", "description": "Test your ability to combine like terms"}');
    
    -- Create sample quiz items for the quiz blocks
    INSERT INTO quiz_items (block_id, kind, prompt, options_json, answer_key_json, points, order_index)
    SELECT 
        lb.id,
        'mcq',
        CASE 
            WHEN l.title = 'What is Algebra?' THEN 'What does a variable represent in algebra?'
            WHEN l.title = 'Basic Algebraic Terms' THEN 'In the expression 5x + 3, what is the coefficient?'
            WHEN l.title = 'Combining Like Terms' THEN 'What is 3x + 2x?'
        END,
        CASE 
            WHEN l.title = 'What is Algebra?' THEN '[{"text": "An unknown number", "id": "a"}, {"text": "A known number", "id": "b"}, {"text": "A mathematical operation", "id": "c"}, {"text": "A type of equation", "id": "d"}]'::jsonb
            WHEN l.title = 'Basic Algebraic Terms' THEN '[{"text": "5", "id": "a"}, {"text": "x", "id": "b"}, {"text": "3", "id": "c"}, {"text": "8", "id": "d"}]'::jsonb
            WHEN l.title = 'Combining Like Terms' THEN '[{"text": "5x", "id": "a"}, {"text": "6", "id": "b"}, {"text": "5x²", "id": "c"}, {"text": "x + 5", "id": "d"}]'::jsonb
        END,
        CASE 
            WHEN l.title = 'What is Algebra?' THEN '{"correct": ["a"]}'::jsonb
            WHEN l.title = 'Basic Algebraic Terms' THEN '{"correct": ["a"]}'::jsonb
            WHEN l.title = 'Combining Like Terms' THEN '{"correct": ["a"]}'::jsonb
        END,
        10,
        1
    FROM lesson_blocks lb
    JOIN course_lessons l ON l.id = lb.lesson_id
    WHERE lb.type = 'quiz';
    
END $$;
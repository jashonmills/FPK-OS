-- Get the course ID first and then create modules and lessons
DO $$ 
DECLARE
    course_uuid uuid;
    module1_id uuid;
    module2_id uuid;
    module3_id uuid;
    module4_id uuid;
    module5_id uuid;
    module6_id uuid;
    module7_id uuid;
    study_module_id uuid;
BEGIN
    -- Get the course ID
    SELECT id INTO course_uuid FROM native_courses WHERE slug = 'empowering-learning-spelling';
    
    -- Create Module 1: Welcome to the Programme
    INSERT INTO course_modules (course_id, title, order_index)
    VALUES (course_uuid, 'Welcome to the Programme', 1)
    RETURNING id INTO module1_id;
    
    INSERT INTO course_lessons (module_id, title, order_index, est_minutes)
    VALUES (module1_id, 'Introduction', 1, 10);
    
    -- Create Module 2: The Learning Process
    INSERT INTO course_modules (course_id, title, order_index)
    VALUES (course_uuid, 'The Learning Process', 2)
    RETURNING id INTO module2_id;
    
    INSERT INTO course_lessons (module_id, title, order_index, est_minutes)
    VALUES 
    (module2_id, 'The Optimal Learning State', 1, 15),
    (module2_id, 'The Spelling Technique - Step by Step', 2, 20);
    
    -- Create Module 3: Final Tips for Success
    INSERT INTO course_modules (course_id, title, order_index)
    VALUES (course_uuid, 'Final Tips for Success', 3)
    RETURNING id INTO module3_id;
    
    INSERT INTO course_lessons (module_id, title, order_index, est_minutes)
    VALUES (module3_id, 'Final Tips', 1, 10);
    
    -- Create Module 4: The Mind-Body Connection
    INSERT INTO course_modules (course_id, title, order_index)
    VALUES (course_uuid, 'The Mind-Body Connection', 4)
    RETURNING id INTO module4_id;
    
    INSERT INTO course_lessons (module_id, title, order_index, est_minutes)
    VALUES (module4_id, 'The Power of the Optimal Learning State', 1, 15);
    
    -- Create Module 5: The Visual Memory System
    INSERT INTO course_modules (course_id, title, order_index)
    VALUES (course_uuid, 'The Visual Memory System', 5)
    RETURNING id INTO module5_id;
    
    INSERT INTO course_lessons (module_id, title, order_index, est_minutes)
    VALUES (module5_id, 'The Power of Visualising', 1, 15);
    
    -- Create Module 6: Advanced Techniques
    INSERT INTO course_modules (course_id, title, order_index)
    VALUES (course_uuid, 'Advanced Techniques', 6)
    RETURNING id INTO module6_id;
    
    INSERT INTO course_lessons (module_id, title, order_index, est_minutes)
    VALUES (module6_id, 'The Swan & The Whiteboard', 1, 15);
    
    -- Create Module 7: Celebrating Success
    INSERT INTO course_modules (course_id, title, order_index)
    VALUES (course_uuid, 'Celebrating Success', 7)
    RETURNING id INTO module7_id;
    
    INSERT INTO course_lessons (module_id, title, order_index, est_minutes)
    VALUES (module7_id, 'The Final Word', 1, 10);
    
    -- Create Study Guide Module
    INSERT INTO course_modules (course_id, title, order_index)
    VALUES (course_uuid, 'Study Guide & Review', 8)
    RETURNING id INTO study_module_id;
    
    INSERT INTO course_lessons (module_id, title, order_index, est_minutes)
    VALUES 
    (study_module_id, 'Quiz - Short Answer Questions', 1, 15),
    (study_module_id, 'Essay Format Questions', 2, 15),
    (study_module_id, 'Glossary of Key Terms', 3, 10);
    
END $$;
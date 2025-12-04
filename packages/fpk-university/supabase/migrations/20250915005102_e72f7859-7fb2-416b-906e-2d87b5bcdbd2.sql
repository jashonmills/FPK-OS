-- Update the course cover URL to use the correct image path format
UPDATE native_courses 
SET cover_url = 'empowering-learning-spelling-hero.jpg'
WHERE slug = 'empowering-learning-spelling';

-- Get lesson IDs and create content blocks
DO $$
DECLARE
    lesson_record record;
BEGIN
    -- Introduction lesson content
    FOR lesson_record IN 
        SELECT cl.id FROM course_lessons cl 
        JOIN course_modules cm ON cl.module_id = cm.id 
        JOIN native_courses nc ON cm.course_id = nc.id 
        WHERE nc.slug = 'empowering-learning-spelling' AND cl.title = 'Introduction'
    LOOP
        INSERT INTO lesson_blocks (lesson_id, order_index, type, data_json) VALUES
        (lesson_record.id, 1, 'rich-text', '{"content": "<p>Hello and welcome to the Empowering Learning for Spelling programme. My name is Allen O''Donoghue and I''m gonna be your guide through this journey.</p><p>So let me ask you a question, what are we here for? Maybe some of us have struggled with spelling in the past, or with maths or just learning in general. Sometimes maybe we have to go into classrooms and feel like we are the only one there that it just doesn''t click for.</p><p>Well guess what, I''m here to tell you you''re not stupid, it''s just that we all learn in very different ways. Some of us learn exactly how school teaches, some of us maybe struggle that way. But today, I''m gonna show you a very simple technique that will help you to spell more effectively.</p><p>Now, we don''t do guarantees here but, I kinda guarantee that probably on day one you''ll be able to spell words that you never thought you''d be able to spell and you''re gonna amaze the people around you.</p><p>All you''re gonna need is one of these and one of these and I suppose you''ll probably need an adult too to give you a hand just to get started on the practice. So let''s dive into the next module and get this started because you''re gonna start to blow everybody''s mind and maybe even blow your own one! Let''s jump in.</p>"}');
    END LOOP;

    -- The Optimal Learning State lesson content
    FOR lesson_record IN 
        SELECT cl.id FROM course_lessons cl 
        JOIN course_modules cm ON cl.module_id = cm.id 
        JOIN native_courses nc ON cm.course_id = nc.id 
        WHERE nc.slug = 'empowering-learning-spelling' AND cl.title = 'The Optimal Learning State'
    LOOP
        INSERT INTO lesson_blocks (lesson_id, order_index, type, data_json) VALUES
        (lesson_record.id, 1, 'rich-text', '{"content": "<p>Okay before we even get started on the technique we got to get ourselves into a nice calm state which helps us learn. It''s what we call The Optimal Learning State, sounds very fancy but it''s not.</p><p>In our experience, a lot of people who struggle with spelling and learning in school are very visual. So maybe you''re very good at art or coming up with stories or being very creative. Well what we are gonna show you today, uses that visual memory that you have but what we have to do is learn to control that visual memory in order to help us learn.</p><p>So, what I''m gonna say is, if you haven''t, please go back to the learning state and find one of the techniques that works best for you just to help to calm yourself down. Now, for me, the easiest one is the Big Strong Tree, so pause this video and do your Big Strong Tree or whichever one of the learning state processes helps you and then come back and press play.</p><p>Okay now you''re back. Hopefully you are feeling a bit calmer and a bit more relaxed. You''re breathing nice and deeply and everything is just chilled. Right, now we''re in the Optimal Learning State which gives the best chance of keeping the information in and now we''re ready to move on to the simple steps. Let''s move onto the next module.</p>"}');
    END LOOP;

    -- The Spelling Technique - Step by Step lesson content
    FOR lesson_record IN 
        SELECT cl.id FROM course_lessons cl 
        JOIN course_modules cm ON cl.module_id = cm.id 
        JOIN native_courses nc ON cm.course_id = nc.id 
        WHERE nc.slug = 'empowering-learning-spelling' AND cl.title = 'The Spelling Technique - Step by Step'
    LOOP
        INSERT INTO lesson_blocks (lesson_id, order_index, type, data_json) VALUES
        (lesson_record.id, 1, 'rich-text', '{"content": "<h4>Empowering Learning: Step by Step</h4><ol><li>Grounding: use the tree or another technique from the Learning State programme.</li><li>Ask person to visualise their dog.</li><li>Check if the picture is still or moving.</li><li>If it is moving stop it by using the dog or traffic lights.</li><li>Ask your partner to visualise the item you want them to spell.</li><li>Write the word on a Post-it.</li><li>Hold the post it where they can see it best.</li><li>Ask ''Can you see the letters?''</li><li>When they can, ask what colours the letters are.</li><li>Ask them to spell the word.</li><li>Then ask them to change the colour of the letters.</li><li>Ask them to spell the word in reverse.</li><li>Use the swan to find their Whiteboard.</li><li>Write the word on a Post-it.</li><li>Repeat steps 6-11.</li><li>Practice for 10 minutes EVERY day for 28 days.</li><li>REMEMBER: it should be fun so be creative with words.</li></ol>"}');
    END LOOP;
END $$;
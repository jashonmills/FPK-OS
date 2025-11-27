-- Update the Introduction lesson to include embedded video in the rich-text content
UPDATE lesson_blocks 
SET data_json = jsonb_build_object(
  'content', '<div style="margin-bottom: 20px;"><iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Welcome to Empowering Learning for Spelling - Introduction" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>' ||
             '<p>Hello and welcome to the Empowering Learning for Spelling programme. My name is Allen O''Donoghue and I''m gonna be your guide through this journey.</p>' ||
             '<p>So let me ask you a question, what are we here for? Maybe some of us have struggled with spelling in the past, or with maths or just learning in general. Sometimes maybe we have to go into classrooms and feel like we are the only one there that it just doesn''t click for.</p>' ||
             '<p>Well guess what, I''m here to tell you you''re not stupid, it''s just that we all learn in very different ways. Some of us learn exactly how school teaches, some of us maybe struggle that way. But today, I''m gonna show you a very simple technique that will help you to spell more effectively.</p>' ||
             '<p>Now, we don''t do guarantees here but, I kinda guarantee that probably on day one you''ll be able to spell words that you never thought you''d be able to spell and you''re gonna amaze the people around you.</p>' ||
             '<p>All you''re gonna need is one of these and one of these and I suppose you''ll probably need an adult too to give you a hand just to get started on the practice. So let''s dive into the next module and get this started because you''re gonna start to blow everybody''s mind and maybe even blow your own one! Let''s jump in.</p>'
)
WHERE lesson_id = '22e1a70e-dd45-40c2-8c64-ea9ee9596bc0' 
AND type = 'rich-text';
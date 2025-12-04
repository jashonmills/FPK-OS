-- Add video block for Introduction lesson
INSERT INTO lesson_blocks (lesson_id, type, order_index, data_json)
SELECT 
  '22e1a70e-dd45-40c2-8c64-ea9ee9596bc0', -- Introduction lesson ID
  'video',
  0,
  jsonb_build_object(
    'videoUrl', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'title', 'Welcome to Empowering Learning for Spelling',
    'description', 'Introduction video with Allen O''Donoghue'
  )
WHERE NOT EXISTS (
  SELECT 1 FROM lesson_blocks 
  WHERE lesson_id = '22e1a70e-dd45-40c2-8c64-ea9ee9596bc0' 
  AND type = 'video'
);

-- Update the existing rich-text block to have order_index 1 (after video)
UPDATE lesson_blocks 
SET order_index = 1
WHERE lesson_id = '22e1a70e-dd45-40c2-8c64-ea9ee9596bc0' 
AND type = 'rich-text';
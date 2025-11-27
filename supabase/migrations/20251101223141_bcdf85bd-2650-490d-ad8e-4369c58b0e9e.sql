-- Fix Spanish 101 course framework type
UPDATE courses 
SET framework_type = 'sequential'
WHERE slug = 'spanish-101';
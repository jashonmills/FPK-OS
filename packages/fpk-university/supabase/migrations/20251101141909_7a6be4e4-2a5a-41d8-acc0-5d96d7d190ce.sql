-- Update introduction-to-philosophy course to published status
UPDATE courses 
SET status = 'published'
WHERE id = 'introduction-to-philosophy';
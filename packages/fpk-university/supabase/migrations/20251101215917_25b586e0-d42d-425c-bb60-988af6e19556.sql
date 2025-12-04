-- Update French 101 background image to use local path
UPDATE courses 
SET background_image = '/course-images/french-101-bg.jpg'
WHERE slug = 'french-101';
-- Update Spanish 101 course with generated background image
UPDATE courses 
SET background_image = '/course-images/spanish-101-bg.jpg'
WHERE slug = 'spanish-101';
-- Update background images for migrating courses
UPDATE courses 
SET background_image = '/assets/interactive-science-bg.jpg'
WHERE slug = 'interactive-science';

UPDATE courses 
SET background_image = '/assets/elt-bg.jpg'
WHERE slug = 'elt-empowering-learning-techniques';

UPDATE courses 
SET background_image = '/assets/meditation-bg.jpg'
WHERE slug = 'introduction-video-production';
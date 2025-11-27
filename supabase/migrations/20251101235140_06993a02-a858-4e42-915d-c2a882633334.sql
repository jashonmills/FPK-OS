-- Update course images with AI-generated hero images
UPDATE courses
SET 
  thumbnail_url = '/course-images/german-101-hero.jpg',
  background_image = '/course-images/german-101-hero.jpg'
WHERE slug = 'german-101';

UPDATE courses
SET 
  thumbnail_url = '/course-images/intro-coding-python-hero.jpg',
  background_image = '/course-images/intro-coding-python-hero.jpg'
WHERE slug = 'intro-coding-python';

UPDATE courses
SET 
  thumbnail_url = '/course-images/introduction-to-psychology-hero.jpg',
  background_image = '/course-images/introduction-to-psychology-hero.jpg'
WHERE slug = 'introduction-to-psychology';

UPDATE courses
SET 
  thumbnail_url = '/course-images/personal-finance-investing-hero.jpg',
  background_image = '/course-images/personal-finance-investing-hero.jpg'
WHERE slug = 'personal-finance-investing';

UPDATE courses
SET 
  thumbnail_url = '/course-images/digital-art-graphic-design-hero.jpg',
  background_image = '/course-images/digital-art-graphic-design-hero.jpg'
WHERE slug = 'digital-art-graphic-design';
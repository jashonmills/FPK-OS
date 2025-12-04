-- Add background images for all 5 sequential courses
-- Using placeholder URLs for now - these should be replaced with actual uploaded images

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1920&h=1080&fit=crop'
WHERE slug = 'empowering-learning-numeracy';

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1920&h=1080&fit=crop'
WHERE slug = 'empowering-learning-reading';

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1920&h=1080&fit=crop'
WHERE slug = 'el-spelling-reading';

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=1080&fit=crop'
WHERE slug = 'empowering-learning-handwriting';

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=1080&fit=crop'
WHERE slug = 'el-handwriting';
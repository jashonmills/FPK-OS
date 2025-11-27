-- Fix background image for optimal learning state course
UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&h=1080&fit=crop'
WHERE slug = 'optimal-learning-state';
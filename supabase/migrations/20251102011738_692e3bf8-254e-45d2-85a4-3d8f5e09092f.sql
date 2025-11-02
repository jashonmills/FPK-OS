-- Update Physics course with correct image paths  
UPDATE public.courses 
SET 
  background_image = '/course-images/physics-motion-energy-matter-bg.jpg',
  thumbnail_url = '/course-images/physics-motion-energy-matter-thumbnail.jpg'
WHERE id = 'physics-motion-energy-matter';
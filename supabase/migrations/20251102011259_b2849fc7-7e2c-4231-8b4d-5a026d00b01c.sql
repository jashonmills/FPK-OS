-- Update Physics course with generated images
UPDATE public.courses 
SET 
  background_image = 'physics-motion-energy-matter-bg.jpg',
  thumbnail_url = 'physics-motion-energy-matter.jpg'
WHERE id = 'physics-motion-energy-matter';
-- Clean up incorrect module records for physics course
DELETE FROM public.modules WHERE course_id = 'physics-motion-energy-matter';

-- Update physics course to use V2 Sequential Framework
UPDATE public.courses 
SET 
  framework_type = 'sequential',
  content_version = 'v2'
WHERE id = 'physics-motion-energy-matter';
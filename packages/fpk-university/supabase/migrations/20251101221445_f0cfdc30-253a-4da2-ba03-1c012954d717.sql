-- Fix framework type for web-dev-basics and set published_at for all published courses
UPDATE courses 
SET 
  framework_type = 'sequential',
  published_at = CASE WHEN status = 'published' THEN NOW() ELSE published_at END
WHERE slug = 'web-dev-basics';

-- Set published_at for other published courses that are missing it
UPDATE courses 
SET published_at = NOW()
WHERE slug IN ('french-101', 'intro-drawing-sketching') 
  AND status = 'published' 
  AND published_at IS NULL;

-- Update legacy course records to use v2 framework with proper metadata
-- This fixes the infinite loading state by ensuring all courses have the required routing fields

UPDATE courses 
SET 
  framework_type = 'sequential',
  content_version = 'v2',
  slug = id,
  status = 'published'
WHERE id IN (
  'empowering-learning-handwriting',
  'elt-empowering-learning-techniques',
  'introduction-video-production'
)
AND (framework_type IS NULL OR content_version IS NULL OR slug IS NULL);

-- Phase 1: Populate background_image from thumbnail_url where missing
UPDATE courses 
SET background_image = thumbnail_url 
WHERE background_image IS NULL 
  AND thumbnail_url IS NOT NULL;

-- Phase 2: Set default background image for courses with no image at all
UPDATE courses 
SET background_image = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=800&fit=crop'
WHERE background_image IS NULL;

-- Phase 3: Make background_image NOT NULL with default for future courses
ALTER TABLE courses 
ALTER COLUMN background_image 
SET DEFAULT 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=800&fit=crop';

ALTER TABLE courses 
ALTER COLUMN background_image 
SET NOT NULL;

-- Phase 4: Add comment documenting this as single source of truth
COMMENT ON COLUMN courses.background_image IS 'Single source of truth for course image - used for both card thumbnails and player backgrounds';

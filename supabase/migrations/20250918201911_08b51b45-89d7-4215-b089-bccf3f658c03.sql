-- Add thumbnail_url column to org_courses table
ALTER TABLE org_courses ADD COLUMN thumbnail_url TEXT;

-- Update courses with sample course thumbnail images
UPDATE org_courses SET thumbnail_url = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop' WHERE title LIKE '%Executive%';
UPDATE org_courses SET thumbnail_url = 'https://images.unsplash.com/photo-1521714161819-15534968fc5f?w=500&h=300&fit=crop' WHERE title LIKE '%Writing%';
UPDATE org_courses SET thumbnail_url = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop' WHERE title LIKE '%Math%';
UPDATE org_courses SET thumbnail_url = 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=500&h=300&fit=crop' WHERE title LIKE '%Study%';
UPDATE org_courses SET thumbnail_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop' WHERE title LIKE '%Communication%';
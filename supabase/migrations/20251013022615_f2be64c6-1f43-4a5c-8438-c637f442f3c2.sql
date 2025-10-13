-- Phase 1A + 1B: Update framework types for migrating courses

-- Set Interactive Science to V2 Sequential Framework
UPDATE courses 
SET framework_type = 'sequential',
    updated_at = now()
WHERE slug = 'interactive-science';

-- Set ELT to V2 Sequential Framework
UPDATE courses 
SET framework_type = 'sequential',
    updated_at = now()
WHERE slug = 'elt-empowering-learning-techniques';

-- Set Meditation with David Scullion to Single-Embed Framework
UPDATE courses 
SET framework_type = 'single-embed',
    updated_at = now()
WHERE slug = 'introduction-video-production';
-- Add content_version column to courses table
-- This enables v1 (component-based) and v2 (data-driven) lesson systems

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS content_version TEXT DEFAULT 'v1' CHECK (content_version IN ('v1', 'v2'));

COMMENT ON COLUMN courses.content_version IS 'Lesson rendering system: v1=component-based, v2=data-driven JSON';

-- Update el-handwriting to use v2 system
UPDATE courses 
SET content_version = 'v2' 
WHERE slug = 'el-handwriting' OR id = 'el-handwriting';
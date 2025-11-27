-- Phase 1: Database Unification (Non-Destructive) - Fixed
-- This migration prepares all courses for the new v2 system
-- It will not break existing v1 courses

-- Step 1: Fix courses missing framework_type and slug
UPDATE courses SET framework_type = 'sequential', slug = 'el-handwriting' WHERE id = 'el-handwriting';
UPDATE courses SET framework_type = 'sequential', slug = 'empowering-learning-reading' WHERE id = 'empowering-learning-reading';
UPDATE courses SET framework_type = 'sequential', slug = 'empowering-learning-numeracy' WHERE id = 'empowering-learning-numeracy';
UPDATE courses SET framework_type = 'sequential', slug = 'elt-empowering-learning-techniques' WHERE id = 'elt-empowering-learning-techniques';
UPDATE courses SET framework_type = 'sequential', slug = 'geometry' WHERE id = 'geometry';
UPDATE courses SET framework_type = 'single-embed', slug = 'introduction-video-production' WHERE id = 'introduction-video-production';

-- Step 2: Standardize titles for consistency
UPDATE courses SET title = 'Interactive Geometry Fundamentals' WHERE id = 'geometry';
UPDATE courses SET title = 'Meditation with David Scullion' WHERE id = 'introduction-video-production';
UPDATE courses SET title = 'EL Spelling & Reading' WHERE id = 'el-spelling-reading';

-- Step 3: Mark all sequential courses for v2 migration
-- The UniversalCoursePlayer will use this flag to route them to SequentialCourseShell
UPDATE courses
SET content_version = 'v2'
WHERE framework_type = 'sequential';
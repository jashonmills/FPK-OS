-- Phase 1: Course Correction - Restore proper identity for spelling course
-- Update the el-spelling-reading course to its correct identity
UPDATE courses
SET 
    title = 'Empowering Learning for Spelling',
    slug = 'empowering-learning-for-spelling',
    updated_at = now()
WHERE 
    id = 'el-spelling-reading';
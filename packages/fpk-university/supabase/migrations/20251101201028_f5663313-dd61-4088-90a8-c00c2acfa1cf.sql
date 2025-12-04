-- Phase 1: Update Introduction to Modern Economics to use micro-learning framework
-- This prevents UniversalCoursePlayer from loading the skeleton manifest
-- and ensures the rich InteractiveEconomicsCoursePage is used instead

UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'introduction-modern-economics';
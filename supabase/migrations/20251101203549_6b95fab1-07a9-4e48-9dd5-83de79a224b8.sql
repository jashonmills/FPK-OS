-- Phase 2: Update remaining courses with rich page implementations to use micro-learning framework
-- Prevents UniversalCoursePlayer from attempting to load non-existent manifests
-- Ensures rich course pages are displayed correctly

-- Update Geometry course
UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'geometry';

-- Update Logic & Critical Thinking course
UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'logic-critical-thinking';
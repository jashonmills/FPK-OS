-- Phase 2 (Final): Update remaining courses with rich page implementations to use micro-learning framework
-- Completes the isolation of all courses from UniversalCoursePlayer conflicts

-- Update Neurodiversity course
UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'neurodiversity-strengths-based-approach';

-- Update Money Management course
UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'money-management-teens';

-- Update Interactive Algebra course
UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'interactive-algebra';

-- Update Interactive Trigonometry course
UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'interactive-trigonometry';

-- Update Interactive Linear Equations course
UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'interactive-linear-equations';

-- Update Interactive Science course
UPDATE courses 
SET 
  framework_type = 'micro-learning',
  status = 'published',
  discoverable = true
WHERE slug = 'interactive-science';
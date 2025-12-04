-- Fix course assignment for St. Joseph's students
-- The issue: Students see courses from org_assignments, not organization_course_assignments

-- Step 1: Remove old Empowering Learning State assignment
DELETE FROM org_assignments
WHERE org_id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f'
AND type = 'course'
AND resource_id = 'empowering-learning-state';

-- Step 2: Create new assignment for Optimal Learning State
INSERT INTO org_assignments (org_id, type, resource_id, created_by)
SELECT 
  '446d78ee-420e-4e9a-8d9d-00f06e897e7f',
  'course',
  'learning-state-beta',
  owner_id
FROM organizations
WHERE id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f';

-- Step 3: Create assignment targets for all active students
INSERT INTO org_assignment_targets (assignment_id, target_type, target_id)
SELECT 
  (SELECT id FROM org_assignments 
   WHERE org_id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f' 
   AND type = 'course' 
   AND resource_id = 'learning-state-beta' 
   LIMIT 1),
  'member',
  om.user_id
FROM org_members om
WHERE om.org_id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f'
AND om.status = 'active'
AND om.role = 'student';
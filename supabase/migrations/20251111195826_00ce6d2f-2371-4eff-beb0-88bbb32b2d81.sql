-- Create assignment targets for all active students in St. Joseph's organization
-- This will make the el-reading course appear in their course selection

INSERT INTO org_assignment_targets (
  assignment_id,
  target_id,
  target_type,
  status,
  assigned_at
)
SELECT 
  '78b13eb0-cd88-4088-9fe4-6014c1937e9c'::uuid, -- el-reading assignment ID
  om.user_id,
  'member'::text,
  'pending'::text,
  NOW()
FROM org_members om
WHERE om.org_id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f'
  AND om.role = 'student'
  AND om.status = 'active'
  AND NOT EXISTS (
    -- Avoid duplicates if any targets already exist
    SELECT 1 FROM org_assignment_targets oat2
    WHERE oat2.assignment_id = '78b13eb0-cd88-4088-9fe4-6014c1937e9c'
      AND oat2.target_id = om.user_id
  );
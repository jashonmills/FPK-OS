-- Find and update jashon's role to owner in Waterford and Wexford organization
-- First, let's identify the user and organization
WITH user_info AS (
  SELECT id as user_id, email 
  FROM auth.users 
  WHERE email ILIKE '%jashon%' 
  LIMIT 1
),
org_info AS (
  SELECT id as org_id, name 
  FROM organizations 
  WHERE name ILIKE '%waterford%wexford%' OR name ILIKE '%waterford and wexford%'
  LIMIT 1
)
-- Update the org membership to owner role
UPDATE org_members 
SET role = 'owner'
FROM user_info, org_info
WHERE org_members.user_id = user_info.user_id 
  AND org_members.org_id = org_info.org_id;

-- Also ensure the organization's owner_id is set correctly
WITH user_info AS (
  SELECT id as user_id, email 
  FROM auth.users 
  WHERE email ILIKE '%jashon%' 
  LIMIT 1
),
org_info AS (
  SELECT id as org_id, name 
  FROM organizations 
  WHERE name ILIKE '%waterford%wexford%' OR name ILIKE '%waterford and wexford%'
  LIMIT 1
)
UPDATE organizations 
SET 
  owner_id = user_info.user_id,
  updated_at = now()
FROM user_info, org_info
WHERE organizations.id = org_info.org_id;
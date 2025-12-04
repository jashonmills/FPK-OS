-- Clean up and simplify RLS policies for organizations and org_members

-- First, drop all existing policies on both tables
DROP POLICY IF EXISTS "Admins can view all memberships" ON org_members;
DROP POLICY IF EXISTS "Org leaders can view org members v2" ON org_members;
DROP POLICY IF EXISTS "Org owners can manage members" ON org_members;
DROP POLICY IF EXISTS "Org owners can view members" ON org_members;
DROP POLICY IF EXISTS "System can create memberships" ON org_members;
DROP POLICY IF EXISTS "Users can create org memberships" ON org_members;
DROP POLICY IF EXISTS "Users can join via invite" ON org_members;
DROP POLICY IF EXISTS "Users can update their own membership" ON org_members;
DROP POLICY IF EXISTS "Users can view their own membership" ON org_members;
DROP POLICY IF EXISTS "admin_full_access_members" ON org_members;
DROP POLICY IF EXISTS "org_members_delete" ON org_members;
DROP POLICY IF EXISTS "org_members_insert" ON org_members;
DROP POLICY IF EXISTS "org_members_select" ON org_members;
DROP POLICY IF EXISTS "org_members_update" ON org_members;
DROP POLICY IF EXISTS "org_owner_access_members" ON org_members;
DROP POLICY IF EXISTS "user_own_membership_access" ON org_members;

DROP POLICY IF EXISTS "Anyone can check org slugs" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "admin_all_access" ON organizations;
DROP POLICY IF EXISTS "create_access" ON organizations;
DROP POLICY IF EXISTS "org_member_read" ON organizations;
DROP POLICY IF EXISTS "org_owner_read" ON organizations;
DROP POLICY IF EXISTS "owner_access" ON organizations;
DROP POLICY IF EXISTS "owner_full_access" ON organizations;
DROP POLICY IF EXISTS "public_slug_check" ON organizations;

-- Create simplified and clear RLS policies for org_members
CREATE POLICY "Users can view their own memberships"
  ON org_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own memberships"
  ON org_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own memberships"
  ON org_members FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Org owners can manage all memberships in their org"
  ON org_members FOR ALL
  USING (EXISTS (
    SELECT 1 FROM organizations 
    WHERE id = org_members.org_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all memberships"
  ON org_members FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create simplified RLS policies for organizations
CREATE POLICY "Anyone can view active organizations"
  ON organizations FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Org owners can update their organizations"
  ON organizations FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all organizations"
  ON organizations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
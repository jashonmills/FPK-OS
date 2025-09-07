-- Remove the circular dependency by simplifying organization policies
-- Drop the policy that causes circular reference
DROP POLICY IF EXISTS "member_view_access" ON public.organizations;

-- The remaining policies don't reference org_members, so no recursion:
-- 1. "admin_all_access" - only checks has_role()
-- 2. "owner_access" - only checks owner_id = auth.uid()
-- 3. "public_view_access" - allows all (true)
-- 4. "create_access" - only checks auth.role()
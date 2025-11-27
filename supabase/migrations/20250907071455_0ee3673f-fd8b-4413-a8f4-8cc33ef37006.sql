-- Fix RLS policies on org_members table to prevent recursion
-- Drop all existing policies on org_members
DROP POLICY IF EXISTS "Users can create their own memberships" ON public.org_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.org_members;
DROP POLICY IF EXISTS "Users can update their own memberships" ON public.org_members;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON public.org_members;
DROP POLICY IF EXISTS "Organization owners can manage memberships" ON public.org_members;
DROP POLICY IF EXISTS "Admins can manage all memberships" ON public.org_members;
DROP POLICY IF EXISTS "Members can view org members" ON public.org_members;
DROP POLICY IF EXISTS "Owners can manage org members" ON public.org_members;
DROP POLICY IF EXISTS "admins_full_access" ON public.org_members;
DROP POLICY IF EXISTS "org_member_select_policy" ON public.org_members;
DROP POLICY IF EXISTS "org_member_insert_policy" ON public.org_members;
DROP POLICY IF EXISTS "org_member_update_policy" ON public.org_members;
DROP POLICY IF EXISTS "org_member_delete_policy" ON public.org_members;

-- Create simple, non-recursive policies for org_members
CREATE POLICY "admin_full_access_members" 
ON public.org_members 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "org_owner_access_members" 
ON public.org_members 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE organizations.id = org_members.org_id 
    AND organizations.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE organizations.id = org_members.org_id 
    AND organizations.owner_id = auth.uid()
  )
);

CREATE POLICY "user_own_membership_access" 
ON public.org_members 
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
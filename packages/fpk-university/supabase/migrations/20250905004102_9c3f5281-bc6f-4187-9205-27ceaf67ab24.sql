-- Fix circular dependency between organizations and org_members RLS policies

-- Create a security definer function to check if user can access organization without circular dependency
CREATE OR REPLACE FUNCTION public.user_can_access_org(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Direct owner check (no RLS involved)
  RETURN EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id 
    AND owner_id = check_user_id
  );
END;
$function$;

-- Drop and recreate organizations policies to avoid circular dependencies
DROP POLICY IF EXISTS "org_select_members" ON public.organizations;
DROP POLICY IF EXISTS "org_insert_owner_self" ON public.organizations;
DROP POLICY IF EXISTS "org_update_owner_or_admin" ON public.organizations;
DROP POLICY IF EXISTS "org_delete_owner_or_admin" ON public.organizations;

-- Create new organizations policies without circular dependencies
CREATE POLICY "org_select_by_owner_or_admin" ON public.organizations
FOR SELECT USING (
  auth_is_admin() OR 
  owner_id = auth.uid() OR
  user_is_org_member_direct(id, auth.uid())
);

CREATE POLICY "org_insert_by_authenticated" ON public.organizations
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  owner_id = auth.uid()
);

CREATE POLICY "org_update_by_owner_or_admin" ON public.organizations
FOR UPDATE USING (
  auth_is_admin() OR 
  owner_id = auth.uid()
) WITH CHECK (
  auth_is_admin() OR 
  owner_id = auth.uid()
);

CREATE POLICY "org_delete_by_owner_or_admin" ON public.organizations
FOR DELETE USING (
  auth_is_admin() OR 
  owner_id = auth.uid()
);

-- Update org_members INSERT policy to allow initial owner creation
DROP POLICY IF EXISTS "org_members_insert_by_owner_or_admin" ON public.org_members;

CREATE POLICY "org_members_insert_by_owner_or_admin" ON public.org_members
FOR INSERT WITH CHECK (
  auth_is_admin() OR 
  user_can_access_org(organization_id, auth.uid()) OR
  -- Allow inserting yourself as member during org creation
  (user_id = auth.uid() AND user_can_access_org(organization_id, auth.uid()))
);
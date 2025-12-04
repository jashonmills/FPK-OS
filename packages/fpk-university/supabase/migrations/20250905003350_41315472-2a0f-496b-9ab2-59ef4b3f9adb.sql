-- Fix infinite recursion in org_members RLS policies
-- Create security definer function to check org membership without triggering RLS
CREATE OR REPLACE FUNCTION public.user_is_org_member_direct(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE organization_id = org_id 
    AND user_id = check_user_id 
    AND status = 'active'
  );
END;
$function$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "org_members_select" ON public.org_members;
DROP POLICY IF EXISTS "org_members_insert_by_owner_or_admin" ON public.org_members;
DROP POLICY IF EXISTS "org_members_modify_by_owner_or_admin" ON public.org_members;
DROP POLICY IF EXISTS "org_members_delete_by_owner_or_admin" ON public.org_members;

-- Create new policies using security definer functions to avoid recursion
CREATE POLICY "org_members_select" ON public.org_members
FOR SELECT USING (
  auth_is_admin() OR 
  user_id = auth.uid() OR 
  user_is_org_owner(organization_id) OR
  user_is_org_member_direct(organization_id, auth.uid())
);

CREATE POLICY "org_members_insert_by_owner_or_admin" ON public.org_members
FOR INSERT WITH CHECK (
  auth_is_admin() OR 
  user_is_org_owner(organization_id)
);

CREATE POLICY "org_members_modify_by_owner_or_admin" ON public.org_members
FOR UPDATE USING (
  auth_is_admin() OR 
  user_is_org_owner(organization_id)
) WITH CHECK (
  auth_is_admin() OR 
  user_is_org_owner(organization_id)
);

CREATE POLICY "org_members_delete_by_owner_or_admin" ON public.org_members
FOR DELETE USING (
  auth_is_admin() OR 
  user_is_org_owner(organization_id)
);
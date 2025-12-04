-- Create SECURITY DEFINER helper functions to avoid RLS recursion

-- Helper function to check if user is admin (already exists, but ensure it's correct)
CREATE OR REPLACE FUNCTION public.auth_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'admin',
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    ),
    false
  );
$$;

-- Helper function to check if user is owner of organization
CREATE OR REPLACE FUNCTION public.is_org_owner(p_user_id uuid, p_org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = p_org_id AND o.owner_id = p_user_id
  );
$$;

-- Helper function to check if user is member of organization
CREATE OR REPLACE FUNCTION public.is_org_member(p_user_id uuid, p_org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members m
    WHERE m.organization_id = p_org_id AND m.user_id = p_user_id AND m.status = 'active'
  );
$$;

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION public.is_org_owner(uuid,uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid,uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.auth_is_admin() TO anon, authenticated, service_role;

-- Fix org_members RLS policies to avoid recursion
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- Drop existing recursive policies
DROP POLICY IF EXISTS "Users can view members of their organizations" ON public.org_members;
DROP POLICY IF EXISTS "Organization owners can manage members" ON public.org_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.org_members;
DROP POLICY IF EXISTS "Organization owners can add members" ON public.org_members;
DROP POLICY IF EXISTS "Organization owners can update members" ON public.org_members;
DROP POLICY IF EXISTS "Organization owners can remove members" ON public.org_members;

-- Create new non-recursive policies using SECURITY DEFINER functions
CREATE POLICY "org_members_select" ON public.org_members
FOR SELECT USING (
  public.auth_is_admin()
  OR public.is_org_owner(auth.uid(), organization_id)
  OR public.is_org_member(auth.uid(), organization_id)
  OR auth.uid() = user_id
);

CREATE POLICY "org_members_insert" ON public.org_members
FOR INSERT WITH CHECK (
  public.auth_is_admin()
  OR public.is_org_owner(auth.uid(), organization_id)
);

CREATE POLICY "org_members_update" ON public.org_members
FOR UPDATE USING (
  public.auth_is_admin()
  OR public.is_org_owner(auth.uid(), organization_id)
) WITH CHECK (
  public.auth_is_admin()
  OR public.is_org_owner(auth.uid(), organization_id)
);

CREATE POLICY "org_members_delete" ON public.org_members
FOR DELETE USING (
  public.auth_is_admin()
  OR public.is_org_owner(auth.uid(), organization_id)
);

-- Update organizations policies to use helper functions and avoid recursion
DROP POLICY IF EXISTS "Users can view organizations they own or are members of" ON public.organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can delete their organizations" ON public.organizations;
DROP POLICY IF EXISTS "org_insert_by_authenticated_or_admin" ON public.organizations;

-- Create new non-recursive policies for organizations
CREATE POLICY "org_select_policy" ON public.organizations
FOR SELECT USING (
  public.auth_is_admin()
  OR owner_id = auth.uid()
  OR public.is_org_member(auth.uid(), id)
);

CREATE POLICY "org_insert_policy" ON public.organizations
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    owner_id = auth.uid() OR
    public.auth_is_admin()
  )
);

CREATE POLICY "org_update_policy" ON public.organizations
FOR UPDATE USING (
  public.auth_is_admin() OR owner_id = auth.uid()
) WITH CHECK (
  public.auth_is_admin() OR owner_id = auth.uid()
);

CREATE POLICY "org_delete_policy" ON public.organizations
FOR DELETE USING (
  public.auth_is_admin() OR owner_id = auth.uid()
);
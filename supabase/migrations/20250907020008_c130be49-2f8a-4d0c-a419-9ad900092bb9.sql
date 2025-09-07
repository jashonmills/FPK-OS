-- Fix infinite recursion in org_members RLS policies by creating security definer functions

-- First, create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.user_is_org_owner_direct(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Direct owner check (no RLS involved)
  RETURN EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id 
    AND owner_id = check_user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.user_is_org_member_direct(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE organization_id = org_id 
    AND user_id = check_user_id 
    AND status = 'active'
  );
END;
$$;

-- Drop existing problematic policies on org_members
DROP POLICY IF EXISTS "Users can view their org memberships" ON public.org_members;
DROP POLICY IF EXISTS "Users can create memberships" ON public.org_members;
DROP POLICY IF EXISTS "Org owners can manage members" ON public.org_members;
DROP POLICY IF EXISTS "Admins can manage all memberships" ON public.org_members;

-- Create new non-recursive policies for org_members
CREATE POLICY "Users can view their own memberships"
ON public.org_members FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Org owners can view members"
ON public.org_members FOR SELECT
USING (public.user_is_org_owner_direct(organization_id, auth.uid()));

CREATE POLICY "Admins can view all memberships"
ON public.org_members FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can create memberships"
ON public.org_members FOR INSERT
WITH CHECK (true);

CREATE POLICY "Org owners can manage members"
ON public.org_members FOR ALL
USING (public.user_is_org_owner_direct(organization_id, auth.uid()));

CREATE POLICY "Admins can manage all memberships"
ON public.org_members FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Also fix organizations policies to avoid recursion
DROP POLICY IF EXISTS "Organization owners can manage" ON public.organizations;
DROP POLICY IF EXISTS "Users can view organizations they are members of" ON public.organizations;
DROP POLICY IF EXISTS "Admins can view all organizations" ON public.organizations;

-- Create cleaner organization policies
CREATE POLICY "Organization owners can manage their orgs"
ON public.organizations FOR ALL
USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all organizations"
ON public.organizations FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view organizations they own or are members of" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization members can view their orgs" ON public.organizations;

-- Create a safe security definer function to check org membership
CREATE OR REPLACE FUNCTION public.user_can_view_org(org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is owner
  IF EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id AND owner_id = auth.uid()
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if user is active member
  IF EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid() 
    AND status = 'active'
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if user is admin
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create new safe RLS policies
CREATE POLICY "Users can view accessible organizations"
ON public.organizations
FOR SELECT
USING (user_can_view_org(id));

CREATE POLICY "Owners and admins can update organizations"
ON public.organizations
FOR UPDATE
USING (
  (owner_id = auth.uid()) OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);
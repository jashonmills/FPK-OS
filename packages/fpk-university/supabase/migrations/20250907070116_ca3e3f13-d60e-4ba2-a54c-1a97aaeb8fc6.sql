-- Fix RLS policies for organizations table to allow admins to see all organizations
-- First drop existing conflicting policies
DROP POLICY IF EXISTS "Users can view organizations they own or are members of" ON public.organizations;
DROP POLICY IF EXISTS "Users can view accessible organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organizations" ON public.organizations;

-- Create clean, non-conflicting policies
CREATE POLICY "Admins can manage all organizations" 
ON public.organizations 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Organization owners can manage their organizations" 
ON public.organizations 
FOR ALL
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Members can view their organization" 
ON public.organizations 
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_members.org_id = organizations.id 
    AND org_members.user_id = auth.uid() 
    AND org_members.status = 'active'
  )
);
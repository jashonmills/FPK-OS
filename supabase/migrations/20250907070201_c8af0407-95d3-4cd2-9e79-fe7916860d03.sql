-- Clean up conflicting RLS policies on organizations table
DROP POLICY IF EXISTS "Admins can manage all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can manage their orgs" ON public.organizations;
DROP POLICY IF EXISTS "org_select_policy" ON public.organizations;
DROP POLICY IF EXISTS "org_update_policy" ON public.organizations;
DROP POLICY IF EXISTS "org_delete_policy" ON public.organizations;
DROP POLICY IF EXISTS "org_insert_policy" ON public.organizations;
DROP POLICY IF EXISTS "Members can read their org" ON public.organizations;
DROP POLICY IF EXISTS "Owners can update their org" ON public.organizations;

-- Create single, clear policies without conflicts
CREATE POLICY "Admin access to all organizations" 
ON public.organizations 
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owner access to their organizations" 
ON public.organizations 
FOR ALL
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Member can view their organization" 
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

CREATE POLICY "Public can view basic org info by slug" 
ON public.organizations 
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create organizations" 
ON public.organizations 
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
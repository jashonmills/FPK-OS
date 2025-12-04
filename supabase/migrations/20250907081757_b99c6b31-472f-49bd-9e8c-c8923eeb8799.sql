-- Fix RLS policies for organization creation

-- Fix organizations RLS policies to allow creation by authenticated users
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
CREATE POLICY "Users can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Ensure org_members policies allow creation (using correct column name)
DROP POLICY IF EXISTS "Users can create org memberships" ON public.org_members;
CREATE POLICY "Users can create org memberships" 
ON public.org_members 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() 
  OR EXISTS(
    SELECT 1 FROM public.organizations o 
    WHERE o.id = org_members.org_id 
    AND o.owner_id = auth.uid()
  )
);

-- Ensure we can read organizations by slug for uniqueness checking
DROP POLICY IF EXISTS "Anyone can check org slugs" ON public.organizations;
CREATE POLICY "Anyone can check org slugs" 
ON public.organizations 
FOR SELECT 
USING (true);
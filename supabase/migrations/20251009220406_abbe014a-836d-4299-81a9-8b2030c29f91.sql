-- Drop and recreate family_members RLS policies to fix onboarding

-- Drop all existing family_members policies
DROP POLICY IF EXISTS "Family owners can manage members" ON public.family_members;
DROP POLICY IF EXISTS "Users can add themselves to families they created" ON public.family_members;
DROP POLICY IF EXISTS "Family owners can add other members" ON public.family_members;
DROP POLICY IF EXISTS "Family owners can update members" ON public.family_members;
DROP POLICY IF EXISTS "Family owners can delete other members" ON public.family_members;

-- Create new policies with correct logic
-- Policy 1: Users can insert themselves as owners of families they just created
CREATE POLICY "family_members_insert_self_as_owner"
  ON public.family_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND role = 'owner'
    AND EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
        AND families.created_by = auth.uid()
    )
  );

-- Policy 2: Family owners can insert other members (not themselves)
CREATE POLICY "family_members_owners_insert_others"
  ON public.family_members FOR INSERT
  WITH CHECK (
    public.is_family_owner(auth.uid(), family_id)
  );

-- Policy 3: Family owners can update members
CREATE POLICY "family_members_owners_update"
  ON public.family_members FOR UPDATE
  USING (public.is_family_owner(auth.uid(), family_id));

-- Policy 4: Family owners can delete members (except themselves)
CREATE POLICY "family_members_owners_delete_others"
  ON public.family_members FOR DELETE
  USING (
    public.is_family_owner(auth.uid(), family_id)
    AND user_id != auth.uid()
  );
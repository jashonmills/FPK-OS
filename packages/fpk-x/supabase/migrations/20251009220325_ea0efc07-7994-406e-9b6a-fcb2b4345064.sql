-- Fix RLS policies to allow family creation and initial member setup

-- Drop the overly restrictive "Family owners can manage members" policy
DROP POLICY IF EXISTS "Family owners can manage members" ON public.family_members;

-- Create separate policies for family_members table
-- Allow users to insert themselves as owners of families they created
CREATE POLICY "Users can add themselves to families they created"
  ON public.family_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
        AND families.created_by = auth.uid()
    )
  );

-- Allow family owners to insert other members
CREATE POLICY "Family owners can add other members"
  ON public.family_members FOR INSERT
  WITH CHECK (
    user_id != auth.uid()
    AND public.is_family_owner(auth.uid(), family_id)
  );

-- Allow family owners to update members
CREATE POLICY "Family owners can update members"
  ON public.family_members FOR UPDATE
  USING (public.is_family_owner(auth.uid(), family_id));

-- Allow family owners to delete members (except themselves)
CREATE POLICY "Family owners can delete other members"
  ON public.family_members FOR DELETE
  USING (
    public.is_family_owner(auth.uid(), family_id)
    AND user_id != auth.uid()
  );
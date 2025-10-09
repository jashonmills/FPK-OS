-- Fix families SELECT RLS policy to allow viewing families you created
-- This solves the circular dependency during onboarding

DROP POLICY IF EXISTS "Users can view families they belong to" ON public.families;

CREATE POLICY "Users can view their families"
  ON public.families FOR SELECT
  USING (
    -- Can see families you created
    created_by = auth.uid()
    OR
    -- Can see families you're a member of
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = families.id
        AND family_members.user_id = auth.uid()
    )
  );
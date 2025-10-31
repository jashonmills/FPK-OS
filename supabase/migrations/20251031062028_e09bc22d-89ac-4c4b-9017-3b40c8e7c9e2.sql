-- Fix channel creation and add admin delete capabilities

-- Drop existing policies that might be blocking channel creation
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Creators can delete their conversations" ON public.conversations;

-- Recreate the insert policy to allow channel creation
CREATE POLICY "Authenticated users can create conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Allow admins to delete any conversation, and creators to delete their own
CREATE POLICY "Admins can delete any conversation, creators can delete own"
ON public.conversations
FOR DELETE
TO authenticated
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  )
);
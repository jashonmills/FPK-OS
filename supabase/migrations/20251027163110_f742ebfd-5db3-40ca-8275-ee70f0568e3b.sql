-- Drop the incorrect RLS policy for creating posts
DROP POLICY IF EXISTS "Circle members can create posts" ON posts;

-- Create a security definer function to check if a persona belongs to a user
CREATE OR REPLACE FUNCTION public.user_owns_persona(_user_id uuid, _persona_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.personas
    WHERE id = _persona_id
      AND user_id = _user_id
  )
$$;

-- Create the correct RLS policy for creating posts
CREATE POLICY "Circle members can create posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (
  public.user_owns_persona(auth.uid(), author_id)
  AND EXISTS (
    SELECT 1
    FROM circle_members
    WHERE circle_members.circle_id = posts.circle_id
      AND circle_members.user_id = auth.uid()
  )
);

-- Also update the "Authors can update own posts" policy
DROP POLICY IF EXISTS "Authors can update own posts" ON posts;

CREATE POLICY "Authors can update own posts"
ON posts
FOR UPDATE
TO authenticated
USING (public.user_owns_persona(auth.uid(), author_id));

-- Also update the "Authors or circle admins can delete posts" policy
DROP POLICY IF EXISTS "Authors or circle admins can delete posts" ON posts;

CREATE POLICY "Authors or circle admins can delete posts"
ON posts
FOR DELETE
TO authenticated
USING (
  public.user_owns_persona(auth.uid(), author_id)
  OR EXISTS (
    SELECT 1
    FROM circle_members
    WHERE circle_members.circle_id = posts.circle_id
      AND circle_members.user_id = auth.uid()
      AND circle_members.role = 'ADMIN'::circle_role
  )
);
-- Fix infinite recursion in circle_members RLS policy
-- Create a security definer function to check circle membership
CREATE OR REPLACE FUNCTION public.is_circle_member(_circle_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.circle_members
    WHERE circle_id = _circle_id
      AND user_id = _user_id
  )
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view members of circles they belong to" ON public.circle_members;

-- Create a new policy using the security definer function
CREATE POLICY "Users can view members of circles they belong to"
  ON public.circle_members FOR SELECT
  USING (public.is_circle_member(circle_id, auth.uid()));
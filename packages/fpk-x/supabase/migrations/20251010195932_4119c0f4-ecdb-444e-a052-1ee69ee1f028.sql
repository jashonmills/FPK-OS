-- Create security definer function to check if two users share a family
CREATE OR REPLACE FUNCTION public.users_share_family(_user_id_1 uuid, _user_id_2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.family_members fm1
    INNER JOIN public.family_members fm2 ON fm1.family_id = fm2.family_id
    WHERE fm1.user_id = _user_id_1
      AND fm2.user_id = _user_id_2
  )
$$;

-- Drop the existing problematic policy that causes circular dependency
DROP POLICY IF EXISTS "Users can view family member profiles" ON public.profiles;

-- Create new policy using the security definer function
CREATE POLICY "Users can view family member profiles"
ON public.profiles
FOR SELECT
TO public
USING (
  (auth.uid() = id) OR users_share_family(auth.uid(), id)
);
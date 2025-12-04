-- Create a helper function to check if user exists in auth.users
CREATE OR REPLACE FUNCTION public.user_exists_check(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE id = user_id);
END;
$$;
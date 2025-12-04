-- Create a security definer function to lookup user ID by email
-- This allows edge functions to find existing users without full admin access
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_user_id UUID;
BEGIN
  -- Query auth.users table using security definer privileges
  SELECT id INTO found_user_id
  FROM auth.users
  WHERE email = LOWER(user_email)
  LIMIT 1;
  
  RETURN found_user_id;
END;
$$;
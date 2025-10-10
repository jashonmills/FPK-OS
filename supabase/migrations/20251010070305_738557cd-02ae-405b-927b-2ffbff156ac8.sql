-- Create a function to check if a user has completed onboarding
-- by verifying if they are a member of any family
CREATE OR REPLACE FUNCTION public.check_user_onboarding_status()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_family BOOLEAN;
BEGIN
  -- Check if the current user is a member of any family
  SELECT EXISTS (
    SELECT 1
    FROM public.family_members
    WHERE user_id = auth.uid()
  ) INTO has_family;
  
  RETURN has_family;
END;
$$;
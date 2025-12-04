
-- Fix user deletion issue by allowing service_role to bypass RLS on organizations
-- The service_role needs to update owner_id and created_by when users are deleted

-- First, let's create a policy that allows service_role to update organizations
-- when performing user deletion cascades
CREATE POLICY "Service role can update for user deletion"
  ON public.organizations
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Also ensure service_role can select for the cascades
CREATE POLICY "Service role can select all organizations"
  ON public.organizations
  FOR SELECT
  TO service_role
  USING (true);

-- Add comment explaining why these policies exist
COMMENT ON POLICY "Service role can update for user deletion" ON public.organizations IS 
'Allows Supabase auth system to properly handle user deletion cascades by updating owner_id and created_by fields';

COMMENT ON POLICY "Service role can select all organizations" ON public.organizations IS 
'Allows Supabase auth system to read organizations during user deletion cascades';

-- Drop the duplicate policy
DROP POLICY IF EXISTS "users_create_new_org" ON public.organizations;

-- The "Users can create their own organizations" policy will remain
-- Check for and remove any remaining triggers that reference updated_at column
-- Remove the generic updated_at trigger if it exists on org_members
DROP TRIGGER IF EXISTS update_org_members_updated_at ON public.org_members;
DROP TRIGGER IF EXISTS update_updated_at ON public.org_members;
DROP TRIGGER IF EXISTS set_updated_at ON public.org_members;

-- Also check if there's a generic trigger using the update_updated_at_column function
SELECT tgname, tgrelid::regclass as table_name 
FROM pg_trigger 
WHERE tgrelid = 'public.org_members'::regclass;
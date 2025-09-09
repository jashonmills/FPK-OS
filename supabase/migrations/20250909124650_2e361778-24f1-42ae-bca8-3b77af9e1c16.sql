-- Remove the problematic trigger that tries to update a non-existent updated_at column
DROP TRIGGER IF EXISTS update_org_members_updated_at ON public.org_members;
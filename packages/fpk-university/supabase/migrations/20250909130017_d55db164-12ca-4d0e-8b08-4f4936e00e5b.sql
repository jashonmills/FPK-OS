-- Remove the duplicate trigger that's causing infinite recursion
-- Keep the proper one (organizations_updated_at_trigger using update_organizations_updated_at)
-- Remove the problematic one (update_organizations_updated_at using update_updated_at_column)
DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
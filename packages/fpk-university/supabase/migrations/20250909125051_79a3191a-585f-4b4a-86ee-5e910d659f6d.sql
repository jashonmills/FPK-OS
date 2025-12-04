-- Remove any trigger that uses the update_updated_at_column function on org_members
DROP TRIGGER IF EXISTS update_updated_at_column_trigger ON public.org_members;
DROP TRIGGER IF EXISTS trigger_update_updated_at ON public.org_members;
DROP TRIGGER IF EXISTS org_members_update_updated_at ON public.org_members;

-- Check what triggers are using the update_updated_at_column function
SELECT t.tgname as trigger_name, 
       c.relname as table_name,
       p.proname as function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE p.proname = 'update_updated_at_column'
AND c.relname = 'org_members';
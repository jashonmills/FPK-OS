-- Check all triggers on org_members table to identify the infinite recursion issue
SELECT 
    t.tgname as trigger_name,
    t.tgtype,
    p.proname as function_name,
    t.tgenabled,
    pg_get_triggerdef(t.oid) as trigger_definition
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' 
AND c.relname = 'org_members'
ORDER BY t.tgname;
-- Check if there's a global trigger or any remaining trigger on org_members that might reference updated_at
-- Let's look for any triggers on org_members that might be calling update_updated_at_column
SELECT t.tgname, p.proname, p.prosrc
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE c.relname = 'org_members'
AND (p.proname LIKE '%updated_at%' OR p.prosrc LIKE '%updated_at%');

-- Also check if there are any event triggers that might be affecting org_members
SELECT * FROM pg_event_trigger;
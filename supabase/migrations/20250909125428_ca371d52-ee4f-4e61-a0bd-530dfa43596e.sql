-- Let's check the actual definition of the update_updated_at_column function
-- to see if it's checking for the existence of the column first
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'update_updated_at_column';

-- Also check if there might be any inherited triggers from table inheritance
SELECT schemaname, tablename, attname, inherited 
FROM pg_stats 
WHERE tablename = 'org_members' 
AND schemaname = 'public';
-- Get the definitions of the functions causing infinite recursion
SELECT p.proname, p.prosrc 
FROM pg_proc p 
WHERE p.proname IN ('update_instructor_count', 'update_org_seat_usage');

-- Let's also check if these functions are updating the same table they're triggered on
-- which would cause infinite recursion
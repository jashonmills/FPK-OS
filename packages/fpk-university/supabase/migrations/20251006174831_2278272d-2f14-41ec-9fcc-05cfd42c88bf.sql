-- Drop the old version of org_create_invite that uses interval type
-- This resolves the function overloading conflict (PGRST203)

DROP FUNCTION IF EXISTS public.org_create_invite(uuid, text, integer, interval);

-- Ensure we only have the new version with text interval and created_by parameter
-- This function should already exist from the previous migration
-- Force refresh of foreign key constraints to clear any caching issues

-- Drop and recreate the foreign key constraints with a clean slate
ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_owner_id_fkey CASCADE;

ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_created_by_fkey CASCADE;

-- Recreate with explicit reference to auth schema users table
ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
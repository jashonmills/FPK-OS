-- Fix foreign key constraint to point to auth.users instead of users table

-- Drop the incorrect foreign key constraint
ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_owner_id_fkey;

-- Add the correct foreign key constraint pointing to auth.users
ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;
-- Fix all foreign key constraints on organizations table to point to auth.users

-- Drop all existing foreign key constraints that might be pointing to wrong tables
ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_owner_id_fkey;

ALTER TABLE public.organizations 
DROP CONSTRAINT IF EXISTS organizations_created_by_fkey;

-- Add correct foreign key constraints pointing to auth.users
ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
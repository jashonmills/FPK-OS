-- Critical fix: Allow organizations.owner_id to be nullable
-- This is required for ON DELETE SET NULL to work when deleting users
-- Without this, user deletion fails with "null value in column owner_id violates not-null constraint"

ALTER TABLE public.organizations 
ALTER COLUMN owner_id DROP NOT NULL;

-- Verify the constraint was removed by checking existing data
-- Organizations can now have NULL owner_id when the owner is deleted
COMMENT ON COLUMN public.organizations.owner_id IS 'User ID of organization owner. Can be NULL if owner account is deleted.';
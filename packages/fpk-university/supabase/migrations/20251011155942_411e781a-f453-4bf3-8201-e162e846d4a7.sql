-- Remove the restrictive check constraint on org_members.role
-- The member_role enum already enforces valid values, so the check constraint is redundant
ALTER TABLE public.org_members
  DROP CONSTRAINT IF EXISTS org_members_role_check;
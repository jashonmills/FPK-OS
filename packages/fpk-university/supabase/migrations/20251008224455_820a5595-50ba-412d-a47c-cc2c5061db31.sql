-- Phase 3: Remove old org_invites table (shareable code system)
-- This table is being replaced by the user_invites email-only system
DROP TABLE IF EXISTS public.org_invites CASCADE;

-- Create index on user_invites for faster email lookup
-- (without predicate since now() is not immutable)
CREATE INDEX IF NOT EXISTS idx_user_invites_email
ON public.user_invites(invited_email);
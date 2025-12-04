-- Phase 1: Create secure token-based invite system
-- This replaces the problematic org_invites.code system with UUID tokens

-- Create the user_invites table for secure, single-use invitation tokens
CREATE TABLE IF NOT EXISTS public.user_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_token TEXT UNIQUE NOT NULL,
  invited_email TEXT NOT NULL,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days') NOT NULL,
  is_used BOOLEAN DEFAULT false NOT NULL,
  used_at TIMESTAMPTZ,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'instructor')),
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_user_invites_token ON public.user_invites(invite_token);
CREATE INDEX idx_user_invites_org ON public.user_invites(org_id);
CREATE INDEX idx_user_invites_email ON public.user_invites(invited_email);
CREATE INDEX idx_user_invites_expires ON public.user_invites(expires_at) WHERE is_used = false;
CREATE INDEX idx_user_invites_created_by ON public.user_invites(created_by);

-- Enable RLS
ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Org leaders (owners/instructors) can view invites for their organization
CREATE POLICY "Org leaders can view org invites"
  ON public.user_invites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = user_invites.org_id
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('owner', 'instructor')
        AND org_members.status = 'active'
    )
  );

-- Policy: Org leaders can create invites for their organization
CREATE POLICY "Org leaders can create invites"
  ON public.user_invites
  FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = user_invites.org_id
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('owner', 'instructor')
        AND org_members.status = 'active'
    )
  );

-- Policy: Anyone can read invites for validation (needed for public /join page)
-- Edge functions will validate token security (expiration, usage, etc.)
CREATE POLICY "Public can validate invite tokens"
  ON public.user_invites
  FOR SELECT
  USING (true);

-- Policy: Edge functions can update invites (mark as used)
CREATE POLICY "Service can update invites"
  ON public.user_invites
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Org leaders can delete/revoke invites
CREATE POLICY "Org leaders can delete invites"
  ON public.user_invites
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE org_members.org_id = user_invites.org_id
        AND org_members.user_id = auth.uid()
        AND org_members.role IN ('owner', 'instructor')
        AND org_members.status = 'active'
    )
  );

-- Add deprecated flag to old org_invites table for migration tracking
ALTER TABLE public.org_invites ADD COLUMN IF NOT EXISTS deprecated BOOLEAN DEFAULT false;

-- Add comment explaining the new system
COMMENT ON TABLE public.user_invites IS 
'Secure token-based invitation system. Uses cryptographically secure UUID tokens for single-use, time-limited organization invitations. Replaces the code-based org_invites system.';

COMMENT ON COLUMN public.user_invites.invite_token IS 
'Cryptographically secure UUID token generated via crypto.randomUUID() in edge function. Single-use only.';

COMMENT ON COLUMN public.user_invites.invited_email IS 
'Email address of the person being invited. Must match the authenticated user email during acceptance.';

COMMENT ON COLUMN public.user_invites.expires_at IS 
'Token expiration timestamp. Default 7 days from creation. Invites cannot be accepted after expiration.';
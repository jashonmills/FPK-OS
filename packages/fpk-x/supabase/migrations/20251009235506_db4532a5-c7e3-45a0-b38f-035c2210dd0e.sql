-- ========================================
-- INVITATIONS TABLE
-- ========================================
CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  inviter_id UUID NOT NULL,
  invitee_email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('contributor', 'viewer')),
  token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + interval '7 days',
  UNIQUE(family_id, invitee_email, status)
);

-- Create index for token lookups
CREATE INDEX idx_invites_token ON public.invites(token) WHERE status = 'pending';
CREATE INDEX idx_invites_family_status ON public.invites(family_id, status);

-- Enable RLS
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Family members can view their family's invites
CREATE POLICY "Family members can view their family invites"
  ON public.invites FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

-- RLS Policy: Only owners can create invites
CREATE POLICY "Family owners can create invites"
  ON public.invites FOR INSERT
  WITH CHECK (
    is_family_owner(auth.uid(), family_id) AND
    inviter_id = auth.uid()
  );

-- RLS Policy: Only owners can update invites (for resending/revoking)
CREATE POLICY "Family owners can update invites"
  ON public.invites FOR UPDATE
  USING (is_family_owner(auth.uid(), family_id));

-- RLS Policy: Only owners can delete invites
CREATE POLICY "Family owners can delete invites"
  ON public.invites FOR DELETE
  USING (is_family_owner(auth.uid(), family_id));

-- ========================================
-- UPDATE DELETE POLICIES FOR GRANULAR CONTROL
-- ========================================

-- INCIDENT LOGS: Owners can delete anything, creators can delete their own
DROP POLICY IF EXISTS "Family owners can delete incident logs" ON public.incident_logs;
CREATE POLICY "Users can delete incident logs based on role"
  ON public.incident_logs FOR DELETE
  USING (
    is_family_owner(auth.uid(), family_id) OR
    created_by = auth.uid()
  );

-- PARENT LOGS: Owners can delete anything, creators can delete their own
DROP POLICY IF EXISTS "Owner can delete parent logs" ON public.parent_logs;
CREATE POLICY "Users can delete parent logs based on role"
  ON public.parent_logs FOR DELETE
  USING (
    is_family_owner(auth.uid(), family_id) OR
    created_by = auth.uid()
  );

-- EDUCATOR LOGS: Owners can delete anything, creators can delete their own
DROP POLICY IF EXISTS "Family owners can delete educator logs" ON public.educator_logs;
CREATE POLICY "Users can delete educator logs based on role"
  ON public.educator_logs FOR DELETE
  USING (
    is_family_owner(auth.uid(), family_id) OR
    created_by = auth.uid()
  );

-- SLEEP RECORDS: Owners can delete anything, creators can delete their own
DROP POLICY IF EXISTS "Owner can delete sleep records" ON public.sleep_records;
CREATE POLICY "Users can delete sleep records based on role"
  ON public.sleep_records FOR DELETE
  USING (
    is_family_owner(auth.uid(), family_id) OR
    created_by = auth.uid()
  );

-- PROGRESS METRICS: Keep existing owner-only policy (referenced in analytics)
-- No change needed here

-- ========================================
-- HELPER FUNCTION FOR ROLE CHECKING
-- ========================================
CREATE OR REPLACE FUNCTION public.get_user_family_role(_user_id uuid, _family_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.family_members
  WHERE user_id = _user_id
    AND family_id = _family_id
  LIMIT 1;
$$;

-- ========================================
-- FUNCTION TO CLEAN UP EXPIRED INVITES
-- ========================================
CREATE OR REPLACE FUNCTION public.mark_expired_invites()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.invites
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < now();
END;
$$;
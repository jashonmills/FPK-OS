-- Fix org_create_invite to use gen_random_uuid() instead of gen_random_bytes()
-- This is more reliable and doesn't depend on pgcrypto extension

CREATE OR REPLACE FUNCTION public.org_create_invite(
  p_org_id UUID,
  p_role TEXT,
  p_max_uses INTEGER DEFAULT 100,
  p_expires_interval TEXT DEFAULT '30 days',
  p_created_by UUID DEFAULT auth.uid()
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Check if user has permission to create invites for this org
  IF NOT EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_id = p_org_id 
    AND user_id = p_created_by
    AND status = 'active'
    AND role IN ('owner', 'instructor')
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to create invite';
  END IF;

  -- Generate unique invite code using gen_random_uuid() which is built-in
  -- Format: inv_<random-hex-string>
  v_code := 'inv_' || replace(gen_random_uuid()::text, '-', '');
  
  -- Calculate expiration
  v_expires_at := NOW() + p_expires_interval::INTERVAL;
  
  -- Insert invite
  INSERT INTO public.org_invites (
    org_id,
    code,
    role,
    max_uses,
    expires_at,
    created_by
  ) VALUES (
    p_org_id,
    v_code,
    p_role::member_role,
    p_max_uses,
    v_expires_at,
    p_created_by
  );
  
  RETURN v_code;
END;
$$;
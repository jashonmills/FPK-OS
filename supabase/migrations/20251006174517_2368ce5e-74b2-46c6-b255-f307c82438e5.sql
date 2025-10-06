-- Fix org_create_invite to work with edge functions (service role)
-- The function needs to accept a creator_id parameter since auth.uid() returns NULL in service role context

DROP FUNCTION IF EXISTS public.org_create_invite(uuid, text, integer, text);

CREATE OR REPLACE FUNCTION public.org_create_invite(
  p_org_id uuid,
  p_role text,
  p_max_uses integer DEFAULT 100,
  p_expires_interval text DEFAULT '30 days',
  p_created_by uuid DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_code text;
  v_creator_id uuid;
BEGIN
  -- Use provided creator_id or fall back to auth.uid()
  v_creator_id := COALESCE(p_created_by, auth.uid());
  
  -- Check if creator has permission (only when creator_id is provided)
  IF v_creator_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = p_org_id 
      AND user_id = v_creator_id
      AND role IN ('owner', 'instructor')
      AND status = 'active'
    ) THEN
      RAISE EXCEPTION 'Insufficient permissions to create invite';
    END IF;
  END IF;
  
  -- Generate unique invite code
  LOOP
    v_code := 'inv_' || encode(gen_random_bytes(16), 'hex');
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.org_invites WHERE code = v_code
    );
  END LOOP;
  
  -- Create the invite
  INSERT INTO public.org_invites (
    org_id,
    code,
    role,
    max_uses,
    uses_count,
    expires_at,
    created_by,
    status
  ) VALUES (
    p_org_id,
    v_code,
    p_role::member_role,
    p_max_uses,
    0,
    now() + p_expires_interval::interval,
    v_creator_id,
    'pending'
  );
  
  RETURN v_code;
END;
$$;
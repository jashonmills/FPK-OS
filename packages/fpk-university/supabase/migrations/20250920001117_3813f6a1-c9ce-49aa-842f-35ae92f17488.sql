-- Fix accept_invite function to handle missing updated_at field
CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_invite RECORD;
  v_user_id uuid := auth.uid();
  v_result jsonb;
BEGIN
  -- Get invite details
  SELECT * INTO v_invite
  FROM public.org_invites
  WHERE code = p_code
  AND (expires_at IS NULL OR expires_at > now())
  AND uses_count < max_uses;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invite code');
  END IF;
  
  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_id = v_invite.org_id AND user_id = v_user_id AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are already a member of this organization');
  END IF;
  
  -- Create membership without updated_at field
  INSERT INTO public.org_members (org_id, user_id, role, status, created_at)
  VALUES (v_invite.org_id, v_user_id, v_invite.role::member_role, 'active', now());
  
  -- Increment invite usage
  UPDATE public.org_invites
  SET uses_count = uses_count + 1
  WHERE id = v_invite.id;
  
  -- Return success with org info
  SELECT jsonb_build_object(
    'success', true,
    'org_id', v_invite.org_id,
    'role', v_invite.role,
    'organization_name', o.name
  ) INTO v_result
  FROM public.organizations o
  WHERE o.id = v_invite.org_id;
  
  RETURN v_result;
END;
$function$;
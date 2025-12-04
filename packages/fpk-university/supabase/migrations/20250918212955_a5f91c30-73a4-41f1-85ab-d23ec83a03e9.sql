-- Fix the accept_invite function to work with the current invitation system
CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
  
  -- Create membership with proper role casting
  INSERT INTO public.org_members (org_id, user_id, role, status)
  VALUES (v_invite.org_id, v_user_id, v_invite.role::member_role, 'active');
  
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
$$;

-- Create a function to send invitation emails
CREATE OR REPLACE FUNCTION public.send_organization_invitation(
  p_org_id uuid,
  p_email text,
  p_role text DEFAULT 'student'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invite_code text;
  v_org_name text;
  v_inviter_name text;
  v_result jsonb;
BEGIN
  -- Get organization name
  SELECT name INTO v_org_name
  FROM public.organizations
  WHERE id = p_org_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Organization not found');
  END IF;
  
  -- Get inviter name from profiles
  SELECT COALESCE(display_name, full_name, 'Someone') INTO v_inviter_name
  FROM public.profiles
  WHERE id = auth.uid();
  
  -- Create invite using the existing function
  SELECT public.org_create_invite(
    p_org_id,
    p_role,
    1, -- max_uses for email invites
    '7 days'::interval
  ) INTO v_invite_code;
  
  -- Call the edge function to send email
  SELECT content::jsonb INTO v_result
  FROM http((
    'POST',
    current_setting('app.settings.supabase_url') || '/functions/v1/send-invitation-email',
    ARRAY[
      http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')),
      http_header('Content-Type', 'application/json')
    ],
    'application/json',
    jsonb_build_object(
      'email', p_email,
      'organizationName', v_org_name,
      'invitationCode', v_invite_code,
      'inviterName', v_inviter_name
    )::text
  ));
  
  RETURN jsonb_build_object(
    'success', true,
    'invite_code', v_invite_code,
    'message', 'Invitation email sent successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Failed to send invitation email: ' || SQLERRM
    );
END;
$$;
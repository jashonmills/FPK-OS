-- Create function to get comprehensive user entitlements for the User Hub
CREATE OR REPLACE FUNCTION public.get_user_entitlements(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  has_subscription BOOLEAN := false;
  org_memberships JSONB := '[]'::jsonb;
  pending_invites JSONB := '[]'::jsonb;
  is_legacy_student BOOLEAN := false;
  user_email TEXT;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = p_user_id;
  
  -- Check if legacy student (org_students with linked_user_id)
  -- CRITICAL: This is the highest priority check to preserve existing system
  SELECT EXISTS(
    SELECT 1 FROM org_students 
    WHERE linked_user_id = p_user_id
  ) INTO is_legacy_student;
  
  -- Check subscription status (active FPK University subscription)
  SELECT EXISTS(
    SELECT 1 FROM subscribers 
    WHERE user_id = p_user_id 
    AND subscription_status = 'active'
  ) INTO has_subscription;
  
  -- Get all active org memberships with role and org details
  SELECT jsonb_agg(
    jsonb_build_object(
      'org_id', om.org_id,
      'org_name', o.name,
      'role', om.role,
      'status', om.status
    )
  )
  INTO org_memberships
  FROM org_members om
  JOIN organizations o ON o.id = om.org_id
  WHERE om.user_id = p_user_id AND om.status = 'active';
  
  -- Get pending invitations (not used, not expired)
  SELECT jsonb_agg(
    jsonb_build_object(
      'org_id', ui.org_id,
      'org_name', o.name,
      'token', ui.invite_token,
      'role', ui.role,
      'expires_at', ui.expires_at
    )
  )
  INTO pending_invites
  FROM user_invites ui
  JOIN organizations o ON o.id = ui.org_id
  WHERE ui.invited_email = user_email 
  AND NOT ui.is_used 
  AND ui.expires_at > NOW();
  
  -- Build comprehensive result object
  result := jsonb_build_object(
    'has_fpk_subscription', has_subscription,
    'org_memberships', COALESCE(org_memberships, '[]'::jsonb),
    'pending_invites', COALESCE(pending_invites, '[]'::jsonb),
    'is_legacy_student', is_legacy_student
  );
  
  RETURN result;
END;
$$;
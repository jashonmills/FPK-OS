-- Phase 0 Step 2: Harden remaining database functions with SET search_path = public
-- Keep exact same parameter names to avoid signature changes

-- Fix record_audit_event
CREATE OR REPLACE FUNCTION public.record_audit_event(
  p_user_id uuid,
  p_action character varying,
  p_table_name character varying,
  p_record_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_legal_basis text DEFAULT NULL,
  p_purpose text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_audit_id uuid;
BEGIN
  INSERT INTO public.audit_log (
    user_id, action, table_name, record_id,
    old_values, new_values, legal_basis, purpose
  ) VALUES (
    p_user_id, p_action, p_table_name, p_record_id,
    p_old_values, p_new_values, p_legal_basis, p_purpose
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$;

-- Fix user_is_org_owner (keep existing parameter name)
CREATE OR REPLACE FUNCTION public.user_is_org_owner(org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id 
    AND owner_id = auth.uid()
  );
END;
$$;

-- Fix user_is_org_member_safe (keep existing parameter names)
CREATE OR REPLACE FUNCTION public.user_is_org_member_safe(org_id uuid, check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_members.org_id = user_is_org_member_safe.org_id 
    AND org_members.user_id = check_user_id 
    AND status = 'active'
  );
END;
$$;

-- Fix get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS app_role
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'instructor' THEN 2
      ELSE 3
    END
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'user'::app_role);
END;
$$;

-- Fix validate_org_invite
CREATE OR REPLACE FUNCTION public.validate_org_invite(code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite RECORD;
  v_result jsonb;
BEGIN
  SELECT * INTO v_invite
  FROM public.org_invites
  WHERE org_invites.code = validate_org_invite.code
  AND status = 'pending'
  AND (expires_at IS NULL OR expires_at > now())
  AND uses_count < max_uses;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired invite code');
  END IF;
  
  v_result := jsonb_build_object(
    'valid', true,
    'org_id', v_invite.org_id,
    'role', v_invite.role,
    'org_name', (SELECT name FROM public.organizations WHERE id = v_invite.org_id)
  );
  
  RETURN v_result;
END;
$$;
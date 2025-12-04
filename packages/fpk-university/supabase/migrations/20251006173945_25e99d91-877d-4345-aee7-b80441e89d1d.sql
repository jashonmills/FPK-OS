-- Fix Organization Invite System RLS Policies and Security Issues

-- ============================================
-- STEP 1: Fix RLS Policies on org_invites
-- ============================================

-- Drop conflicting/duplicate policies
DROP POLICY IF EXISTS "org_invites_insert" ON public.org_invites;
DROP POLICY IF EXISTS "org_invites_select" ON public.org_invites;
DROP POLICY IF EXISTS "Organization owners can create invitations" ON public.org_invites;
DROP POLICY IF EXISTS "Organization owners can update invitations" ON public.org_invites;
DROP POLICY IF EXISTS "Users can view invitations for organizations they own" ON public.org_invites;

-- Keep the comprehensive "Org leaders can manage invites" policy (covers ALL operations)
-- Keep "Public can view valid invites by code" for accepting invites

-- ============================================
-- STEP 2: Fix Security Issues in Functions
-- ============================================

-- Update accept_invite function with proper search_path
CREATE OR REPLACE FUNCTION public.accept_invite(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_invite RECORD;
  v_user_id uuid := auth.uid();
  v_result jsonb;
BEGIN
  -- Check user is authenticated
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not authenticated');
  END IF;

  -- Get invite details
  SELECT * INTO v_invite
  FROM public.org_invites
  WHERE code = p_code
  AND (expires_at IS NULL OR expires_at > now())
  AND uses_count < max_uses
  AND status = 'pending';
  
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
  
  -- Create membership
  INSERT INTO public.org_members (org_id, user_id, role, status)
  VALUES (v_invite.org_id, v_user_id, v_invite.role::member_role, 'active');
  
  -- Increment invite usage
  UPDATE public.org_invites
  SET uses_count = uses_count + 1,
      status = CASE WHEN uses_count + 1 >= max_uses THEN 'used' ELSE status END
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

-- Update org_create_invite function with proper search_path
CREATE OR REPLACE FUNCTION public.org_create_invite(
  p_org_id uuid, 
  p_role text, 
  p_max_uses integer DEFAULT 100, 
  p_expires_interval interval DEFAULT '30 days'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_code TEXT;
  v_invite_id UUID;
BEGIN
  -- Check if user has permission to create invites
  IF NOT EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_id = p_org_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'instructor') 
    AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to create invite';
  END IF;
  
  -- Generate unique code
  v_code := 'inv_' || encode(gen_random_bytes(16), 'hex');
  
  -- Create invite
  INSERT INTO public.org_invites (
    org_id, code, role, max_uses, expires_at, created_by, status
  ) VALUES (
    p_org_id, v_code, p_role, p_max_uses, 
    CASE WHEN p_expires_interval IS NOT NULL THEN now() + p_expires_interval ELSE NULL END,
    auth.uid(),
    'pending'
  ) RETURNING id INTO v_invite_id;
  
  RETURN v_code;
END;
$$;

-- ============================================
-- STEP 3: Remove Deprecated RPC Function
-- ============================================

-- Drop the deprecated send_organization_invitation function
-- (This was returning an error directing users to use edge function)
DROP FUNCTION IF EXISTS public.send_organization_invitation(uuid, text, text);

-- ============================================
-- STEP 4: Ensure IEP Invites Table Has Proper Status Column
-- ============================================

-- Add status column to iep_invites if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'iep_invites' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.iep_invites 
    ADD COLUMN status text NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'used', 'expired', 'disabled'));
  END IF;
END $$;

-- ============================================
-- STEP 5: Add Helper Function for IEP Invite Validation
-- ============================================

CREATE OR REPLACE FUNCTION public.validate_iep_invite(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_invite RECORD;
BEGIN
  -- Get invite details
  SELECT * INTO v_invite
  FROM public.iep_invites
  WHERE code = p_code
  AND status = 'active'
  AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false, 
      'error', 'Invalid or expired invite code'
    );
  END IF;
  
  -- Check usage limits
  IF v_invite.current_uses >= v_invite.max_uses THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invite code has reached maximum usage limit'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'valid', true,
    'org_id', v_invite.org_id,
    'code', v_invite.code
  );
END;
$$;
-- Fix the broken send_organization_invitation function
DROP FUNCTION IF EXISTS public.send_organization_invitation(uuid, text, text);

-- Create a new function that returns proper response for edge function usage
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
  v_result jsonb;
  v_org_name text;
  v_inviter_name text;
BEGIN
  -- Check if user has permission to send invites
  IF NOT EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_id = p_org_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'instructor') 
    AND status = 'active'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient permissions');
  END IF;

  -- Get organization details
  SELECT name INTO v_org_name
  FROM public.organizations
  WHERE id = p_org_id;
  
  -- Get inviter details
  SELECT COALESCE(display_name, full_name, 'Team Member') INTO v_inviter_name
  FROM public.profiles
  WHERE id = auth.uid();

  -- Return success message indicating to use edge function
  RETURN jsonb_build_object(
    'success', false,
    'error', 'Please use the send-invitation-email edge function instead of this database function',
    'org_name', v_org_name,
    'inviter_name', v_inviter_name
  );
END;
$$;
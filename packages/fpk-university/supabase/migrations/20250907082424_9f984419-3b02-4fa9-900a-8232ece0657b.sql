-- Fix organization creation by using a proper database function

-- Create a function to handle organization creation with proper auth context
CREATE OR REPLACE FUNCTION public.create_organization_with_membership(
  p_name TEXT,
  p_slug TEXT,
  p_description TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL,
  p_plan TEXT DEFAULT 'beta',
  p_seat_cap INTEGER DEFAULT 50,
  p_instructor_limit INTEGER DEFAULT 20,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id UUID;
BEGIN
  -- Verify user is authenticated
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create organization';
  END IF;

  -- Create the organization
  INSERT INTO public.organizations (
    name, 
    slug, 
    description, 
    logo_url, 
    plan, 
    seat_cap, 
    instructor_limit, 
    owner_id, 
    created_by
  ) VALUES (
    p_name,
    p_slug,
    p_description,
    p_logo_url,
    p_plan,
    p_seat_cap,
    p_instructor_limit,
    p_user_id,
    p_user_id
  ) RETURNING id INTO v_org_id;

  -- Create owner membership
  INSERT INTO public.org_members (
    org_id,
    user_id,
    role,
    status
  ) VALUES (
    v_org_id,
    p_user_id,
    'owner',
    'active'
  );

  RETURN v_org_id;
END;
$$;
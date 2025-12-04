-- Fix the create_organization function to properly set owner_id
CREATE OR REPLACE FUNCTION public.create_organization(p_name text, p_slug text, p_plan text DEFAULT 'beta'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_org_id uuid;
BEGIN
  -- Create the organization with proper owner_id
  INSERT INTO public.organizations (name, slug, plan, owner_id, created_by)
  VALUES (p_name, p_slug, p_plan, auth.uid(), auth.uid())
  RETURNING id INTO v_org_id;
  
  -- Create owner membership with correct column names
  INSERT INTO public.org_members (organization_id, user_id, role, status)
  VALUES (v_org_id, auth.uid(), 'owner', 'active');
  
  RETURN v_org_id;
END;
$function$;
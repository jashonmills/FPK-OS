-- Fix database functions that use wrong column names for org_members table

CREATE OR REPLACE FUNCTION public.user_is_org_member(org_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_id = user_is_org_member.org_id AND user_id = auth.uid() AND status = 'active'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.user_org_role(org_id uuid)
 RETURNS member_role
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN (
    SELECT role FROM public.org_members 
    WHERE org_id = user_org_role.org_id AND user_id = auth.uid() AND status = 'active'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_org_member(p_user_id uuid, p_org_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members m
    WHERE m.org_id = p_org_id AND m.user_id = p_user_id AND m.status = 'active'
  );
$function$;

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
  INSERT INTO public.org_members (org_id, user_id, role, status)
  VALUES (v_org_id, auth.uid(), 'owner', 'active');
  
  RETURN v_org_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_organization(p_name text, p_slug text, p_plan text DEFAULT 'beta'::text, p_user_id uuid DEFAULT auth.uid())
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_org_id uuid;
BEGIN
  -- Create the organization with provided user_id
  INSERT INTO public.organizations (name, slug, plan, owner_id, created_by)
  VALUES (p_name, p_slug, p_plan, p_user_id, p_user_id)
  RETURNING id INTO v_org_id;
  
  -- Create owner membership with correct column names
  INSERT INTO public.org_members (org_id, user_id, role, status)
  VALUES (v_org_id, p_user_id, 'owner', 'active');
  
  RETURN v_org_id;
END;
$function$;
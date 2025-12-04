-- Fix ambiguous column references in RLS helper functions

-- Fix user_is_org_member function
CREATE OR REPLACE FUNCTION public.user_is_org_member(org_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_members.org_id = user_is_org_member.org_id 
    AND org_members.user_id = auth.uid() 
    AND org_members.status = 'active'
  );
END;
$function$;

-- Fix user_org_role function
CREATE OR REPLACE FUNCTION public.user_org_role(org_id uuid)
 RETURNS member_role
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
BEGIN
  RETURN (
    SELECT org_members.role FROM public.org_members 
    WHERE org_members.org_id = user_org_role.org_id 
    AND org_members.user_id = auth.uid() 
    AND org_members.status = 'active'
  );
END;
$function$;
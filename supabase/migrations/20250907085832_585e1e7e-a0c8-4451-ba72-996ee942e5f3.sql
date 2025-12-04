-- Fix column name mismatch in triggers - org_members table uses org_id not organization_id

-- Update the seat usage trigger function to use correct column names
CREATE OR REPLACE FUNCTION public.update_org_seat_usage()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update seat usage for the organization
  UPDATE public.organizations 
  SET seats_used = (
    SELECT COUNT(*) 
    FROM public.org_members 
    WHERE org_id = COALESCE(NEW.org_id, OLD.org_id) 
    AND status = 'active'
    AND role = 'student'
  )
  WHERE id = COALESCE(NEW.org_id, OLD.org_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update the instructor count trigger function to use correct column names  
CREATE OR REPLACE FUNCTION public.update_instructor_count()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update instructor count for the organization
  UPDATE public.organizations 
  SET instructors_used = (
    SELECT COUNT(*) 
    FROM public.org_members 
    WHERE org_id = COALESCE(NEW.org_id, OLD.org_id) 
    AND status = 'active'
    AND role = 'instructor'
  )
  WHERE id = COALESCE(NEW.org_id, OLD.org_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;
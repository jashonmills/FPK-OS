-- Fix function search paths for all existing functions
-- The notify_family_members function needs search_path set
DROP FUNCTION IF EXISTS public.notify_family_members() CASCADE;
CREATE OR REPLACE FUNCTION public.notify_family_members()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, reference_id, reference_table)
  SELECT fm.user_id, TG_ARGV[0], TG_ARGV[1], TG_ARGV[2], NEW.id, TG_TABLE_NAME
  FROM public.family_members fm
  WHERE fm.family_id = NEW.family_id
    AND fm.user_id != NEW.created_by;
  
  RETURN NEW;
END;
$function$;

-- Update the update_updated_at_column function
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
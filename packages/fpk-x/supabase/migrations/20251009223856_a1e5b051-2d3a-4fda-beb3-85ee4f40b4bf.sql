-- Fix security warning: Set search_path for notify_family_members function
CREATE OR REPLACE FUNCTION notify_family_members()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, reference_id, reference_table)
  SELECT fm.user_id, TG_ARGV[0], TG_ARGV[1], TG_ARGV[2], NEW.id, TG_TABLE_NAME
  FROM public.family_members fm
  WHERE fm.family_id = NEW.family_id
    AND fm.user_id != NEW.created_by;
  
  RETURN NEW;
END;
$$;
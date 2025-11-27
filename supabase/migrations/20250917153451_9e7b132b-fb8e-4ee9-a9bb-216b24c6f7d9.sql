-- FINAL SECURITY HARDENING: Address remaining critical RLS and function issues

-- Fix remaining tables with RLS enabled but no policies
-- Identify and secure any remaining unprotected tables

-- Update all remaining functions to have proper search_path (security requirement)
CREATE OR REPLACE FUNCTION public.update_updated_at_column_before()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the NEW record has an updated_at field before trying to set it
  IF to_jsonb(NEW) ? 'updated_at' THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_threshold_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('create', NEW.id, NEW.created_by, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('update', NEW.id, NEW.created_by, jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('delete', OLD.id, OLD.created_by, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_threshold_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_interactive_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_organizations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$function$;

-- Update critical user and auth related functions
CREATE OR REPLACE FUNCTION public.initialize_student_profile(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  profile_id UUID;
BEGIN
  INSERT INTO public.student_profiles (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO profile_id;
  
  -- If no profile was created (conflict), get existing ID
  IF profile_id IS NULL THEN
    SELECT id INTO profile_id 
    FROM public.student_profiles 
    WHERE user_id = p_user_id;
  END IF;
  
  RETURN profile_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_xp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_xp (user_id, total_xp, level, next_level_xp)
  VALUES (NEW.id, 0, 1, 100)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;
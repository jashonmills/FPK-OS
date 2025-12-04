-- CRITICAL SECURITY FIXES: Address all remaining RLS and security issues

-- Fix tables with RLS enabled but missing policies
-- activity_log table
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
ON public.activity_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity"
ON public.activity_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can create activity logs"
ON public.activity_log
FOR INSERT
WITH CHECK (true);

-- course_progress table  
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own course progress"
ON public.course_progress
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Org members can view org course progress"
ON public.course_progress
FOR SELECT
USING (
  org_id IS NOT NULL 
  AND user_is_org_member_safe(org_id, auth.uid())
);

CREATE POLICY "Admins can view all course progress"
ON public.course_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix function security issues - update key functions with proper search_path
CREATE OR REPLACE FUNCTION public.generate_invitation_link(org_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  link_code TEXT;
  full_link TEXT;
BEGIN
  -- Generate a unique code
  link_code := encode(gen_random_bytes(16), 'hex');
  full_link := 'org-invite-' || link_code;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.org_invitations WHERE invitation_link = full_link) LOOP
    link_code := encode(gen_random_bytes(16), 'hex');
    full_link := 'org-invite-' || link_code;
  END LOOP;
  
  RETURN full_link;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_scorm_package_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Create base slug from title
  base_slug := lower(regexp_replace(trim(title), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := substring(base_slug from 1 for 50);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and increment if needed
  WHILE EXISTS (SELECT 1 FROM scorm_packages WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$function$;

-- Update trigger functions to have proper search_path
CREATE OR REPLACE FUNCTION public.set_scorm_package_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_scorm_package_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_scorm_package_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
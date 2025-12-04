-- Fix organizations table to add missing columns (without unique constraint)
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS seats_used integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS instructors_used integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS instructor_limit integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS suspended_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS suspended_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS suspended_reason text;

-- Add token column to org_invites for JWT magic links
ALTER TABLE public.org_invites 
ADD COLUMN IF NOT EXISTS token text,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Create helper function for seat counting
CREATE OR REPLACE FUNCTION public.org_increment_seats_if_needed(p_org_id uuid, p_role text)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  IF p_role = 'student' THEN
    UPDATE public.organizations
    SET seats_used = seats_used + 1
    WHERE id = p_org_id;
  ELSIF p_role = 'instructor' THEN
    UPDATE public.organizations
    SET instructors_used = instructors_used + 1
    WHERE id = p_org_id;
  END IF;
END;
$$;

-- Create helper function for seat decrement
CREATE OR REPLACE FUNCTION public.org_decrement_seats_if_needed(p_org_id uuid, p_role text)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  IF p_role = 'student' THEN
    UPDATE public.organizations
    SET seats_used = GREATEST(0, seats_used - 1)
    WHERE id = p_org_id;
  ELSIF p_role = 'instructor' THEN
    UPDATE public.organizations
    SET instructors_used = GREATEST(0, instructors_used - 1)
    WHERE id = p_org_id;
  END IF;
END;
$$;
-- Fix organizations table to add missing columns
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

-- Ensure slug has unique constraint
ALTER TABLE public.organizations 
ADD CONSTRAINT organizations_slug_unique UNIQUE (slug);

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

-- Update triggers to use the new functions
DROP TRIGGER IF EXISTS update_org_seat_usage ON public.org_members;
DROP TRIGGER IF EXISTS update_instructor_count ON public.org_members;

CREATE OR REPLACE FUNCTION public.update_org_usage_counts()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    PERFORM org_increment_seats_if_needed(NEW.org_id, NEW.role);
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    -- If role changed or status changed
    IF OLD.role != NEW.role OR OLD.status != NEW.status THEN
      -- Decrement old
      IF OLD.status = 'active' THEN
        PERFORM org_decrement_seats_if_needed(OLD.org_id, OLD.role);
      END IF;
      -- Increment new
      IF NEW.status = 'active' THEN
        PERFORM org_increment_seats_if_needed(NEW.org_id, NEW.role);
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.status = 'active' THEN
      PERFORM org_decrement_seats_if_needed(OLD.org_id, OLD.role);
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_org_usage_counts
  AFTER INSERT OR UPDATE OR DELETE ON public.org_members
  FOR EACH ROW EXECUTE FUNCTION public.update_org_usage_counts();
-- Add missing fields to organizations table for instructor limits and beta access
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS beta_expiration_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_beta_access BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS instructor_limit INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS instructors_used INTEGER DEFAULT 0;

-- Update existing records to have proper values
UPDATE public.organizations 
SET 
  is_beta_access = (subscription_tier = 'beta'),
  beta_expiration_date = CASE 
    WHEN subscription_tier = 'beta' THEN now() + interval '90 days'
    ELSE NULL 
  END,
  instructor_limit = CASE subscription_tier
    WHEN 'basic' THEN 1
    WHEN 'standard' THEN 3
    WHEN 'premium' THEN 10
    WHEN 'beta' THEN 20
    ELSE 1
  END;

-- Add instructor_role enum to org_members if it doesn't exist
DO $$ BEGIN
  CREATE TYPE member_role AS ENUM ('owner', 'instructor', 'student');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update the org_members table to use the proper enum if needed
-- (This is safe since the enum already exists in the schema)

-- Create function to update instructor count
CREATE OR REPLACE FUNCTION public.update_instructor_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update instructor count for the organization
  UPDATE public.organizations 
  SET instructors_used = (
    SELECT COUNT(*) 
    FROM public.org_members 
    WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id) 
    AND status = 'active'
    AND role = 'instructor'
  )
  WHERE id = COALESCE(NEW.organization_id, OLD.organization_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for instructor count updates
DROP TRIGGER IF EXISTS trigger_update_instructor_count ON public.org_members;
CREATE TRIGGER trigger_update_instructor_count
  AFTER INSERT OR UPDATE OR DELETE ON public.org_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_instructor_count();
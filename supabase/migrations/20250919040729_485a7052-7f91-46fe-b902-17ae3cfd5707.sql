-- Add missing columns to org_assignment_targets table for Phase 4: Assignment Targets & Distribution

-- Add status tracking columns
ALTER TABLE public.org_assignment_targets 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'started', 'completed')),
ADD COLUMN IF NOT EXISTS assigned_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS started_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS due_at timestamp with time zone;

-- Add updated_at column with trigger for automatic updates
ALTER TABLE public.org_assignment_targets 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create trigger for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_org_assignment_targets_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_org_assignment_targets_updated_at ON public.org_assignment_targets;
CREATE TRIGGER update_org_assignment_targets_updated_at
  BEFORE UPDATE ON public.org_assignment_targets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_org_assignment_targets_updated_at();

-- Add index for better performance on student assignment queries
CREATE INDEX IF NOT EXISTS idx_org_assignment_targets_user_status 
ON public.org_assignment_targets (target_id, status, assigned_at DESC)
WHERE target_type = 'user';

-- Add index for assignment management queries
CREATE INDEX IF NOT EXISTS idx_org_assignment_targets_assignment_status 
ON public.org_assignment_targets (assignment_id, status);
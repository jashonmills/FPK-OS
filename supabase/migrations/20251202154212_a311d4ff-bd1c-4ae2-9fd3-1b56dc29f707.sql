-- Add missing columns to org_groups table
ALTER TABLE public.org_groups 
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_org_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_org_groups_timestamp ON public.org_groups;

CREATE TRIGGER update_org_groups_timestamp
  BEFORE UPDATE ON public.org_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_org_groups_updated_at();
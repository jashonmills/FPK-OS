-- Add avatar_url, date_of_birth, and updated_at to org_students table
ALTER TABLE public.org_students 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_org_students_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_org_students_timestamp
  BEFORE UPDATE ON public.org_students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_org_students_updated_at();
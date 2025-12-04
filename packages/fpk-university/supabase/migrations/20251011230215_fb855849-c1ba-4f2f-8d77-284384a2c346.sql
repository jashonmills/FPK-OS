-- Add access_scope column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN access_scope text DEFAULT 'platform' 
CHECK (access_scope IN ('platform', 'organization_only'));

-- Create index for performance
CREATE INDEX idx_profiles_access_scope ON public.profiles(access_scope);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.access_scope IS 
'Determines user access level: platform = full FPK University access, organization_only = restricted to organization environments';
-- Fix the SECURITY DEFINER view warning by dropping and recreating as regular view
DROP VIEW IF EXISTS public.public_organizations;

-- Recreate as a simple view (default is SECURITY INVOKER which is safe)
CREATE VIEW public.public_organizations 
WITH (security_invoker = true)
AS
SELECT 
  id,
  name,
  slug,
  logo_url,
  created_at
FROM public.organizations;

-- Grant access
GRANT SELECT ON public.public_organizations TO anon, authenticated;
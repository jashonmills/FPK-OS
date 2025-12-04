-- CRITICAL SECURITY FIX: Remove anonymous access to student PII
-- The current policy "Anonymous users can view students with tokens" exposes 
-- sensitive student data (names, emails, DOB, parent contacts) to the internet

-- Drop the dangerous anonymous access policy
DROP POLICY IF EXISTS "Anonymous users can view students with tokens" ON public.org_students;

-- Create a secure policy that only allows token-based access to non-PII fields
-- by using a function that validates and returns limited data
CREATE OR REPLACE FUNCTION public.validate_student_activation_token(token_value text)
RETURNS TABLE (
  id uuid,
  org_id uuid,
  first_name text,
  activation_status text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return minimal data needed for activation UI
  -- Full PII is never exposed to anonymous users
  RETURN QUERY
  SELECT 
    s.id,
    s.org_id,
    s.first_name,
    s.activation_status
  FROM public.org_students s
  WHERE s.activation_token = token_value
    AND s.activation_status = 'pending';
END;
$$;

-- Grant execute to anonymous users for the activation flow
GRANT EXECUTE ON FUNCTION public.validate_student_activation_token(text) TO anon;

-- Also fix the organizations public visibility warning
-- Keep public read but restrict to non-sensitive fields via a view
CREATE OR REPLACE VIEW public.public_organizations AS
SELECT 
  id,
  name,
  slug,
  logo_url,
  created_at
FROM public.organizations;

-- Grant access to the public view
GRANT SELECT ON public.public_organizations TO anon, authenticated;

-- Restrict the main organizations table anonymous policy
DROP POLICY IF EXISTS "Anonymous users can view organizations" ON public.organizations;

-- Only authenticated users can view full organization details
CREATE POLICY "Authenticated users can view organizations"
  ON public.organizations
  FOR SELECT
  TO authenticated
  USING (true);

-- Comment for documentation
COMMENT ON FUNCTION public.validate_student_activation_token IS 
'Secure function for student activation flow. Returns only minimal non-PII data needed for the activation UI. Full student records require authenticated access as an org member.';
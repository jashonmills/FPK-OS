-- Create security definer function to check super admin status
CREATE OR REPLACE FUNCTION public.has_super_admin_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
  )
$$;

-- Grant super_admin role to Jashon@fpkuniversity.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role
FROM auth.users
WHERE email = 'Jashon@fpkuniversity.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Add RLS policy for super admins to manage feature flags
CREATE POLICY "Super admins can manage all feature flags"
ON public.feature_flags
FOR ALL
TO authenticated
USING (has_super_admin_role(auth.uid()))
WITH CHECK (has_super_admin_role(auth.uid()));
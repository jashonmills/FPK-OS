-- Grant super_admin role to the correct email (lowercase)
INSERT INTO public.user_roles (user_id, role)
VALUES ('7871ccee-9185-4c22-9eb8-d1acdc3f02ab', 'super_admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;
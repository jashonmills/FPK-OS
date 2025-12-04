-- Grant admin role to the organization owner
INSERT INTO public.user_roles (user_id, role)
VALUES ('5945ec0e-ac76-4a53-8d2d-e034eafc1a25', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Also make sure they're a member of their own organization
INSERT INTO public.org_members (org_id, user_id, role, status)
VALUES ('b43e5a9c-0711-460a-9677-25f0e2da7bb2', '5945ec0e-ac76-4a53-8d2d-e034eafc1a25', 'owner', 'active')
ON CONFLICT (org_id, user_id) DO NOTHING;
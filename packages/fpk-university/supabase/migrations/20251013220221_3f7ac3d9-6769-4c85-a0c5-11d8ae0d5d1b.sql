-- Grant AI Coach access to admin accounts
-- This ensures both admin emails can access /coach/pro
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('5945ec0e-ac76-4a53-8d2d-e034eafc1a25', 'ai_coach_user'),
  ('2f361679-4bbb-4d0f-b75a-533cdf4ec0ed', 'ai_coach_user')
ON CONFLICT (user_id, role) DO NOTHING;
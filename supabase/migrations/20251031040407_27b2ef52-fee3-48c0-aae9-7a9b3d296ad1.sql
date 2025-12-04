-- Add RLS policy to allow admins to update feature flags
CREATE POLICY "Admins can update feature flags"
  ON public.feature_flags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'::app_role
    )
  );
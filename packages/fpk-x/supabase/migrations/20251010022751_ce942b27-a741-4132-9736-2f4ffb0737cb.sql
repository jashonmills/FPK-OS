-- Create trigger function to auto-assign admin role to family creator
CREATE OR REPLACE FUNCTION public.auto_assign_admin_to_family_creator()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert admin role for the user who created the family
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.created_by, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger that runs after a family is created
CREATE TRIGGER assign_admin_on_family_creation
  AFTER INSERT ON public.families
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_admin_to_family_creator();

-- One-time fix: Assign admin role to existing family creators
INSERT INTO public.user_roles (user_id, role)
SELECT DISTINCT created_by, 'admin'::app_role
FROM public.families
WHERE created_by IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;
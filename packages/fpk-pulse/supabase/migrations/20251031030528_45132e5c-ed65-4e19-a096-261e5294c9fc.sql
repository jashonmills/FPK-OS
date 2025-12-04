-- Add password_set tracking to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_set boolean DEFAULT false;

-- Update existing users who have passwords set
UPDATE public.profiles
SET password_set = true
WHERE id IN (
  SELECT id FROM auth.users WHERE encrypted_password IS NOT NULL AND encrypted_password != ''
);

-- Function to check if user has password in auth.users
CREATE OR REPLACE FUNCTION public.user_has_password(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND encrypted_password IS NOT NULL 
    AND encrypted_password != ''
  );
$$;

-- Update the handle_new_user trigger to set password_set based on actual password
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile with password status check
  INSERT INTO public.profiles (id, email, full_name, password_set)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    public.user_has_password(NEW.id)
  );
  
  -- Assign role from metadata or default to member
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id, 
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'member'::app_role)
  );
  
  RETURN NEW;
END;
$$;
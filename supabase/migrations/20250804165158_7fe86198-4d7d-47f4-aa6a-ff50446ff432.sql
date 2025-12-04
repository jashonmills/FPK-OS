-- Update the handle_new_user function to automatically grant beta access to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    display_name,
    beta_access
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'display_name', ''),
    true  -- Automatically grant beta access to all new users
  );
  RETURN new;
END;
$$;
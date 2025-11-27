-- Ensure proper user creation triggers and fix RLS policies

-- Update the handle_new_user trigger to also create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id, 
    full_name, 
    display_name,
    beta_access
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', ''),
    true  -- Automatically grant beta access to all new users
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(NEW.raw_user_meta_data ->> 'full_name', profiles.full_name),
    display_name = COALESCE(NEW.raw_user_meta_data ->> 'display_name', profiles.display_name),
    updated_at = now();

  -- Also initialize user XP
  INSERT INTO public.user_xp (user_id, total_xp, level, next_level_xp)
  VALUES (NEW.id, 0, 1, 100)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix organizations RLS policies to allow creation by new users
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
CREATE POLICY "Users can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Ensure org_members policies allow creation
DROP POLICY IF EXISTS "Users can create org memberships" ON public.org_members;
CREATE POLICY "Users can create org memberships" 
ON public.org_members 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() 
  OR EXISTS(
    SELECT 1 FROM public.organizations o 
    WHERE o.id = org_members.organization_id 
    AND o.owner_id = auth.uid()
  )
);
-- Create missing profiles for org members
INSERT INTO public.profiles (id, display_name, full_name)
SELECT DISTINCT om.user_id, 'Member', 'Member'
FROM public.org_members om
LEFT JOIN public.profiles p ON p.id = om.user_id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Now add the foreign key constraint
ALTER TABLE public.org_members
ADD CONSTRAINT org_members_user_id_profiles_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
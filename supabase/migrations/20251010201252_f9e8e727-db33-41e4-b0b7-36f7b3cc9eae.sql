-- First, delete orphaned family_members records that don't have corresponding auth users
DELETE FROM public.family_members
WHERE user_id IN (
  SELECT fm.user_id
  FROM public.family_members fm
  LEFT JOIN auth.users au ON au.id = fm.user_id
  WHERE au.id IS NULL
);

-- Now add the foreign key constraint from family_members.user_id to profiles.id
ALTER TABLE public.family_members
ADD CONSTRAINT family_members_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
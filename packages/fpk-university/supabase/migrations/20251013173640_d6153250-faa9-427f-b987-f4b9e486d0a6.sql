-- Drop the old check constraint that's blocking admin role
ALTER TABLE public.user_invites 
DROP CONSTRAINT IF EXISTS user_invites_role_check;

-- Add updated check constraint that includes admin
ALTER TABLE public.user_invites 
ADD CONSTRAINT user_invites_role_check 
CHECK (role IN ('owner', 'admin', 'instructor', 'instructor_aide', 'student', 'viewer'));
-- Phase 3: Fix RLS Policies for Admin Course Management
-- This allows admins to update any course, regardless of created_by field

-- 1. Add policy to allow admins to update any course
CREATE POLICY "Admins can update any course"
ON public.courses
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Add policy to allow admins to view all courses (including drafts)
CREATE POLICY "Admins can view all courses"
ON public.courses
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Backfill created_by field for courses that don't have one
-- This query finds the first admin user and assigns ownership
-- If no admin exists, it will use the first user in the system
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Try to find an admin user
  SELECT user_id INTO admin_user_id
  FROM public.user_roles
  WHERE role = 'admin'
  LIMIT 1;
  
  -- If an admin exists, update courses without a creator
  IF admin_user_id IS NOT NULL THEN
    UPDATE public.courses
    SET created_by = admin_user_id,
        updated_at = now()
    WHERE created_by IS NULL;
    
    RAISE NOTICE 'Updated % courses with admin user %', 
      (SELECT COUNT(*) FROM public.courses WHERE created_by = admin_user_id), 
      admin_user_id;
  ELSE
    RAISE NOTICE 'No admin user found - skipping created_by backfill';
  END IF;
END $$;
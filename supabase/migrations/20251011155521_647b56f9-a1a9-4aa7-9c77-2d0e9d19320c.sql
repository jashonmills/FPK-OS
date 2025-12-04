-- Fix remaining foreign key constraints blocking user deletion

-- organization_course_assignments: Set assigned_by to NULL when assigner is deleted
ALTER TABLE public.organization_course_assignments
  DROP CONSTRAINT IF EXISTS organization_course_assignments_assigned_by_fkey;

ALTER TABLE public.organization_course_assignments
  ADD CONSTRAINT organization_course_assignments_assigned_by_fkey 
  FOREIGN KEY (assigned_by) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- file_uploads: Delete uploads when user is deleted
ALTER TABLE public.file_uploads
  DROP CONSTRAINT IF EXISTS file_uploads_user_id_fkey;

ALTER TABLE public.file_uploads
  ADD CONSTRAINT file_uploads_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Fix user deletion issues by handling assigned_by references properly
-- The assigned_by column should be nullable and cascade to NULL when user is deleted

-- First, make assigned_by nullable if it isn't already
ALTER TABLE public.organization_course_assignments 
  ALTER COLUMN assigned_by DROP NOT NULL;

-- Drop the existing foreign key constraint
ALTER TABLE public.organization_course_assignments
  DROP CONSTRAINT IF EXISTS organization_course_assignments_assigned_by_fkey;

-- Recreate it with SET NULL on delete
ALTER TABLE public.organization_course_assignments
  ADD CONSTRAINT organization_course_assignments_assigned_by_fkey
  FOREIGN KEY (assigned_by)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

-- Also check student_course_assignments table for similar issues
ALTER TABLE public.student_course_assignments 
  ALTER COLUMN assigned_by DROP NOT NULL;

ALTER TABLE public.student_course_assignments
  DROP CONSTRAINT IF EXISTS student_course_assignments_assigned_by_fkey;

ALTER TABLE public.student_course_assignments
  ADD CONSTRAINT student_course_assignments_assigned_by_fkey
  FOREIGN KEY (assigned_by)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;

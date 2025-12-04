-- Fix 1: Add missing created_by column to org_groups
ALTER TABLE public.org_groups 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Fix 2: Drop the incorrect foreign key constraint on org_goals.student_id
-- This allows us to update the data
ALTER TABLE public.org_goals
DROP CONSTRAINT IF EXISTS org_goals_student_id_fkey;

-- Fix 3: Update the existing goal BEFORE adding new constraint
-- Change from linked_user_id to org_students.id
UPDATE public.org_goals
SET student_id = '256c2546-9ed3-460f-bc9d-7d4895051424'
WHERE student_id = 'e572b955-23d7-475a-b7ef-668eecb2d225'
AND organization_id = '446d78ee-420e-4e9a-8d9d-00f06e897e7f';

-- Fix 4: NOW add the CORRECT foreign key to org_students
ALTER TABLE public.org_goals
ADD CONSTRAINT org_goals_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.org_students(id) ON DELETE CASCADE;
-- Add 'study_material' as a valid assignment type
ALTER TABLE public.org_assignments 
DROP CONSTRAINT IF EXISTS org_assignments_type_check;

ALTER TABLE public.org_assignments 
ADD CONSTRAINT org_assignments_type_check 
CHECK (type IN ('course', 'goal', 'note', 'study_material'));
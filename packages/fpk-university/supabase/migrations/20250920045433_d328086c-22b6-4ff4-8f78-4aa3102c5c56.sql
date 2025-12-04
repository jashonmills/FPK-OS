-- Make student_id nullable in org_notes table for instructor-created notes
ALTER TABLE public.org_notes ALTER COLUMN student_id DROP NOT NULL;

-- Add a check constraint to ensure either student_id is provided or it's an instructor note
-- (This can be enforced at the application level for now)
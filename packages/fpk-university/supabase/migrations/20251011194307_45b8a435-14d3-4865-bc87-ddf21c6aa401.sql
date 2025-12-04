-- Add student_email column to org_students table for PIN activation links
ALTER TABLE public.org_students 
ADD COLUMN IF NOT EXISTS student_email TEXT;

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_org_students_student_email 
ON public.org_students(student_email);

-- Update the search query to include student_email
COMMENT ON COLUMN public.org_students.student_email IS 'Email address for the student to receive PIN activation links';
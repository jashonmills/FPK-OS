-- Create org_students table for manually added students
CREATE TABLE public.org_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  grade_level TEXT,
  student_id TEXT, -- School-assigned student ID
  date_of_birth DATE,
  parent_email TEXT,
  emergency_contact JSONB DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique student IDs within org (when provided)
  CONSTRAINT unique_student_id_per_org UNIQUE (org_id, student_id),
  -- Ensure one student record per linked user per org
  CONSTRAINT unique_linked_user_per_org UNIQUE (org_id, linked_user_id)
);

-- Enable RLS
ALTER TABLE public.org_students ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Org members can view org students"
ON public.org_students
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_students.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

CREATE POLICY "Org instructors can manage students"
ON public.org_students
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_students.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_students.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
);

-- Create updated_at trigger
CREATE TRIGGER update_org_students_updated_at
BEFORE UPDATE ON public.org_students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column_before();

-- Create indexes for performance
CREATE INDEX idx_org_students_org_id ON public.org_students(org_id);
CREATE INDEX idx_org_students_linked_user_id ON public.org_students(linked_user_id) WHERE linked_user_id IS NOT NULL;
CREATE INDEX idx_org_students_status ON public.org_students(status);
CREATE INDEX idx_org_students_parent_email ON public.org_students(parent_email) WHERE parent_email IS NOT NULL;
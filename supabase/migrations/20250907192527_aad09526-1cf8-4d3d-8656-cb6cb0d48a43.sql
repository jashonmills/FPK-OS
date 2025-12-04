-- Create org_assignments table for organization assignments
CREATE TABLE public.org_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue', 'archived')),
  course_id TEXT REFERENCES public.courses(id),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create org_assignment_submissions table for tracking student submissions
CREATE TABLE public.org_assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.org_assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'late')),
  submission_content TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  graded_at TIMESTAMP WITH TIME ZONE,
  grade NUMERIC(5,2),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create org_note_folders table for organizing notes
CREATE TABLE public.org_note_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  parent_folder_id UUID REFERENCES public.org_note_folders(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, parent_folder_id, name)
);

-- Add folder_id to org_notes table
ALTER TABLE public.org_notes 
ADD COLUMN folder_id UUID REFERENCES public.org_note_folders(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.org_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_note_folders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for org_assignments
CREATE POLICY "Users can view assignments from their organizations" 
ON public.org_assignments 
FOR SELECT 
USING (user_is_org_member_safe(organization_id, auth.uid()));

CREATE POLICY "Instructors can manage assignments in their organizations" 
ON public.org_assignments 
FOR ALL 
USING (user_is_org_leader(organization_id, auth.uid()));

-- Create RLS policies for org_assignment_submissions
CREATE POLICY "Students can view their own submissions" 
ON public.org_assignment_submissions 
FOR SELECT 
USING (
  auth.uid() = student_id OR 
  EXISTS (
    SELECT 1 FROM public.org_assignments oa 
    WHERE oa.id = assignment_id AND user_is_org_leader(oa.organization_id, auth.uid())
  )
);

CREATE POLICY "Students can create their own submissions" 
ON public.org_assignment_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own submissions" 
ON public.org_assignment_submissions 
FOR UPDATE 
USING (auth.uid() = student_id);

CREATE POLICY "Instructors can manage all submissions in their organizations" 
ON public.org_assignment_submissions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.org_assignments oa 
    WHERE oa.id = assignment_id AND user_is_org_leader(oa.organization_id, auth.uid())
  )
);

-- Create RLS policies for org_note_folders
CREATE POLICY "Users can view folders from their organizations" 
ON public.org_note_folders 
FOR SELECT 
USING (user_is_org_member_safe(organization_id, auth.uid()));

CREATE POLICY "Instructors can manage folders in their organizations" 
ON public.org_note_folders 
FOR ALL 
USING (user_is_org_leader(organization_id, auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_org_assignments_organization_id ON public.org_assignments(organization_id);
CREATE INDEX idx_org_assignments_due_date ON public.org_assignments(due_date);
CREATE INDEX idx_org_assignment_submissions_assignment_id ON public.org_assignment_submissions(assignment_id);
CREATE INDEX idx_org_assignment_submissions_student_id ON public.org_assignment_submissions(student_id);
CREATE INDEX idx_org_note_folders_organization_id ON public.org_note_folders(organization_id);
CREATE INDEX idx_org_note_folders_parent_folder_id ON public.org_note_folders(parent_folder_id);
CREATE INDEX idx_org_notes_folder_id ON public.org_notes(folder_id);

-- Create triggers for updated_at
CREATE TRIGGER update_org_assignments_updated_at
  BEFORE UPDATE ON public.org_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_assignment_submissions_updated_at
  BEFORE UPDATE ON public.org_assignment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_note_folders_updated_at
  BEFORE UPDATE ON public.org_note_folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
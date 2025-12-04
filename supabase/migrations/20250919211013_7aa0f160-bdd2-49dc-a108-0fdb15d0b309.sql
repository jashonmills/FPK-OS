-- Create course_drafts table for persistent draft storage
CREATE TABLE public.course_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('scorm', 'manual', 'json', 'csv')),
  source_package_id UUID NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('intro', 'intermediate', 'advanced')),
  duration_minutes INTEGER DEFAULT 30,
  framework TEXT NOT NULL DEFAULT 'interactive_micro_learning' CHECK (framework IN ('interactive_micro_learning', 'sequential_learning')),
  structure JSONB NOT NULL DEFAULT '{"modules": []}',
  status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('parsing', 'ready', 'error')),
  validation JSONB DEFAULT '{"errors": [], "warnings": []}',
  created_by UUID NOT NULL,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_drafts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view drafts in their organization"
ON public.course_drafts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = course_drafts.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

CREATE POLICY "Users can create drafts in their organization"
ON public.course_drafts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = course_drafts.org_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
    AND om.role IN ('owner', 'instructor')
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Users can update drafts they created"
ON public.course_drafts FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete drafts they created"
ON public.course_drafts FOR DELETE
USING (created_by = auth.uid());

-- Add updated_at trigger
CREATE TRIGGER update_course_drafts_updated_at
  BEFORE UPDATE ON public.course_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column_before();

-- Add foreign key constraints
ALTER TABLE public.course_drafts 
ADD CONSTRAINT course_drafts_org_id_fkey 
FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE;

ALTER TABLE public.course_drafts 
ADD CONSTRAINT course_drafts_source_package_id_fkey 
FOREIGN KEY (source_package_id) REFERENCES public.scorm_packages(id) ON DELETE SET NULL;
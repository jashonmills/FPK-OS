-- Create new SCORM Studio tables
-- SCORM Packages table (replaces/enhances existing lesson-based approach)
CREATE TABLE IF NOT EXISTS public.scorm_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID, -- For multi-tenant support if needed
  title TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL DEFAULT '1.2', -- SCORM version (1.2, 2004, etc.)
  manifest_path TEXT NOT NULL,
  zip_path TEXT NOT NULL,
  extract_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'parsed', 'ready', 'archived')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- SCORM SCOs (Sharable Content Objects)
CREATE TABLE IF NOT EXISTS public.scorm_scos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.scorm_packages(id) ON DELETE CASCADE,
  identifier TEXT NOT NULL,
  title TEXT NOT NULL,
  launch_href TEXT NOT NULL,
  parameters TEXT, -- Launch parameters from manifest
  mastery_score INTEGER, -- Mastery threshold if defined
  is_launchable BOOLEAN DEFAULT TRUE,
  seq_order INTEGER DEFAULT 0,
  prerequisites TEXT[], -- Array of prerequisite SCO identifiers
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(package_id, identifier)
);

-- SCORM Enrollments (assigns packages to learners)
CREATE TABLE IF NOT EXISTS public.scorm_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL,
  course_id TEXT, -- Link to existing courses table
  package_id UUID REFERENCES public.scorm_packages(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  due_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'started', 'completed', 'suspended')),
  created_by UUID NOT NULL,
  UNIQUE(learner_id, package_id)
);

-- SCORM Runtime data (SCORM 1.2 CMI data model)
CREATE TABLE IF NOT EXISTS public.scorm_runtime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.scorm_enrollments(id) ON DELETE CASCADE,
  sco_id UUID REFERENCES public.scorm_scos(id) ON DELETE CASCADE,
  
  -- Core CMI elements (SCORM 1.2)
  lesson_location TEXT DEFAULT '', -- cmi.core.lesson_location
  credit TEXT DEFAULT 'credit', -- cmi.core.credit
  lesson_status TEXT DEFAULT 'not attempted' CHECK (lesson_status IN ('not attempted', 'incomplete', 'completed', 'passed', 'failed', 'browsed')),
  entry TEXT DEFAULT 'ab-initio', -- cmi.core.entry
  
  -- Score elements
  score_raw INTEGER,
  score_min INTEGER DEFAULT 0,
  score_max INTEGER DEFAULT 100,
  
  -- Time elements  
  total_time TEXT DEFAULT '00:00:00', -- HH:MM:SS format
  session_time TEXT DEFAULT '00:00:00',
  
  -- Data elements
  suspend_data TEXT DEFAULT '', -- For resume functionality
  launch_data TEXT DEFAULT '', -- Static launch data
  
  -- Mastery and completion
  mastery_score INTEGER, -- Resolved mastery score for this attempt
  
  -- Interactions (stored as JSONB for flexibility)
  interactions JSONB DEFAULT '[]',
  
  -- Tracking
  last_commit_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  initialized_at TIMESTAMP WITH TIME ZONE,
  terminated_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(enrollment_id, sco_id)
);

-- Enable RLS on all tables
ALTER TABLE public.scorm_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorm_scos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorm_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorm_runtime ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scorm_packages
CREATE POLICY "Admins can manage all packages" ON public.scorm_packages
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Package creators can manage their packages" ON public.scorm_packages
  FOR ALL USING (created_by = auth.uid());

-- RLS Policies for scorm_scos  
CREATE POLICY "Admins can manage all SCOs" ON public.scorm_scos
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view SCOs in packages they have access to" ON public.scorm_scos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.scorm_packages sp 
      WHERE sp.id = scorm_scos.package_id 
      AND (sp.created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

-- RLS Policies for scorm_enrollments
CREATE POLICY "Admins can manage all enrollments" ON public.scorm_enrollments
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own enrollments" ON public.scorm_enrollments
  FOR SELECT USING (learner_id = auth.uid());

CREATE POLICY "Instructors can manage enrollments they created" ON public.scorm_enrollments
  FOR ALL USING (created_by = auth.uid());

-- RLS Policies for scorm_runtime
CREATE POLICY "Admins can manage all runtime data" ON public.scorm_runtime
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their own runtime data" ON public.scorm_runtime
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.scorm_enrollments se 
      WHERE se.id = scorm_runtime.enrollment_id 
      AND se.learner_id = auth.uid()
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_scorm_scos_package_id ON public.scorm_scos(package_id);
CREATE INDEX IF NOT EXISTS idx_scorm_enrollments_learner_id ON public.scorm_enrollments(learner_id);
CREATE INDEX IF NOT EXISTS idx_scorm_enrollments_package_id ON public.scorm_enrollments(package_id);
CREATE INDEX IF NOT EXISTS idx_scorm_runtime_enrollment_sco ON public.scorm_runtime(enrollment_id, sco_id);

-- Add updated_at trigger for packages
CREATE TRIGGER update_scorm_packages_updated_at
  BEFORE UPDATE ON public.scorm_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to migrate existing SCORM lessons to new structure
CREATE OR REPLACE FUNCTION public.migrate_existing_scorm_lessons()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  lesson_rec RECORD;
  package_id UUID;
  sco_id UUID;
BEGIN
  -- Migrate existing lessons that have SCORM packages
  FOR lesson_rec IN 
    SELECT DISTINCT l.*, c.title as course_title
    FROM lessons l
    LEFT JOIN courses c ON l.course_id = c.id
    WHERE l.scorm_package_url IS NOT NULL
  LOOP
    -- Create package record
    INSERT INTO public.scorm_packages (
      title, 
      description, 
      manifest_path, 
      zip_path, 
      extract_path,
      status,
      created_by
    ) VALUES (
      COALESCE(lesson_rec.title, 'Migrated SCORM Package'),
      lesson_rec.description,
      COALESCE(lesson_rec.scorm_package_url, ''),
      COALESCE(lesson_rec.scorm_package_url, ''),
      COALESCE(lesson_rec.scorm_package_url, ''),
      'ready',
      COALESCE(lesson_rec.instructor_id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) RETURNING id INTO package_id;
    
    -- Create a default SCO for each lesson
    INSERT INTO public.scorm_scos (
      package_id,
      identifier,
      title,
      launch_href,
      mastery_score,
      seq_order
    ) VALUES (
      package_id,
      'sco_' || lesson_rec.id,
      lesson_rec.title,
      COALESCE(lesson_rec.scorm_package_url, ''),
      COALESCE(lesson_rec.mastery_score, 80),
      COALESCE(lesson_rec.lesson_number, 1)
    ) RETURNING id INTO sco_id;
    
    -- Update lesson to reference the new package
    UPDATE lessons 
    SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('scorm_package_id', package_id)
    WHERE id = lesson_rec.id;
    
  END LOOP;
  
  RAISE NOTICE 'Migration completed successfully';
END;
$$;
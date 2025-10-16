-- Create wizard_sessions table
CREATE TABLE public.wizard_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  wizard_type TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL,
  session_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wizard_sessions
ALTER TABLE public.wizard_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for wizard_sessions
CREATE POLICY "Family members can view their wizard sessions"
  ON public.wizard_sessions
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert wizard sessions"
  ON public.wizard_sessions
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id) AND created_by = auth.uid());

CREATE POLICY "Family members can update their wizard sessions"
  ON public.wizard_sessions
  FOR UPDATE
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can delete their wizard sessions"
  ON public.wizard_sessions
  FOR DELETE
  USING (is_family_member(auth.uid(), family_id));

-- Create wizard_completions table
CREATE TABLE public.wizard_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.wizard_sessions(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  wizard_type TEXT NOT NULL,
  generated_report JSONB NOT NULL,
  pdf_url TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wizard_completions
ALTER TABLE public.wizard_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for wizard_completions
CREATE POLICY "Family members can view their wizard completions"
  ON public.wizard_completions
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert wizard completions"
  ON public.wizard_completions
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

-- Create indexes for better query performance
CREATE INDEX idx_wizard_sessions_family_student ON public.wizard_sessions(family_id, student_id);
CREATE INDEX idx_wizard_sessions_status ON public.wizard_sessions(status);
CREATE INDEX idx_wizard_sessions_wizard_type ON public.wizard_sessions(wizard_type);
CREATE INDEX idx_wizard_completions_family_student ON public.wizard_completions(family_id, student_id);
CREATE INDEX idx_wizard_completions_wizard_type ON public.wizard_completions(wizard_type);

-- Insert feature flags for all assessments
INSERT INTO public.feature_flags (flag_key, flag_name, description, is_enabled, rollout_percentage) VALUES
  ('enable-assessment-hub', 'Assessment Hub', 'Enable the main Assessment Hub page', false, 0),
  ('enable-assessment-iep', 'IEP Blueprint', 'Enable FPX-IEP Blueprint™ assessment', false, 0),
  ('enable-assessment-fba', 'Behavioral Function Analysis', 'Enable FPX-BFA™ assessment', false, 0),
  ('enable-assessment-504', '504 Framework', 'Enable FPX-504 Framework™ assessment', false, 0),
  ('enable-assessment-ifsp', 'IFSP Guide', 'Enable FPX-IFSP Guide™ assessment', false, 0),
  ('enable-assessment-transition', 'Transition Roadmap', 'Enable FPX-Transition Roadmap™ assessment', false, 0),
  ('enable-assessment-bip', 'BIP Architect', 'Enable FPX-BIP Architect™ assessment', false, 0),
  ('enable-assessment-afs', 'Adaptive Functioning Scale', 'Enable FPX-AFS™ assessment', false, 0),
  ('enable-assessment-scq', 'Social Communication Questionnaire', 'Enable FPX-SCQ™ assessment', false, 0),
  ('enable-assessment-srs', 'Social Responsiveness Scale', 'Enable FPX-SRS™ assessment', false, 0),
  ('enable-assessment-efs', 'Executive Function Snapshot', 'Enable FPX-EFS™ assessment', false, 0),
  ('enable-assessment-crs', 'Comprehensive Rating Scale', 'Enable FPX-CRS™ assessment', false, 0),
  ('enable-assessment-atp', 'Attention & Task Performance', 'Enable FPX-ATP™ assessment', false, 0),
  ('enable-assessment-pas', 'Phonological Awareness Screener', 'Enable FPX-PAS™ assessment', false, 0),
  ('enable-assessment-rls', 'Receptive Language Scale', 'Enable FPX-RLS™ assessment', false, 0),
  ('enable-assessment-els', 'Expressive Language Scale', 'Enable FPX-ELS™ assessment', false, 0),
  ('enable-assessment-cas', 'Cognitive Abilities Screener', 'Enable FPX-CAS™ assessment', false, 0),
  ('enable-assessment-dls', 'Daily Living Skills Inventory', 'Enable FPX-DLS™ assessment', false, 0)
ON CONFLICT (flag_key) DO NOTHING;
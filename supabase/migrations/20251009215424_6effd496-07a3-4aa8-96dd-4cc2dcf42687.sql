-- ========================================
-- MULTI-TENANT CORE TABLES FOR SPECIAL EDUCATION PROGRESS TRACKING
-- ========================================

-- Families Table (Primary Tenant Entity)
CREATE TABLE public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'basic', 'premium'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'paused', 'cancelled'
  max_students INTEGER DEFAULT 3,
  storage_limit_mb INTEGER DEFAULT 500,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Students Table (One family can have multiple students)
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  school_name TEXT,
  grade_level TEXT,
  primary_diagnosis TEXT[], -- ['autism', 'ADHD', 'epilepsy', etc.]
  secondary_conditions TEXT[],
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Family Members (Role-based access within a family)
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL, -- 'owner', 'parent', 'guardian', 'therapist', 'educator', 'viewer'
  relationship_to_student TEXT, -- 'mother', 'father', 'teacher', 'ABA therapist', etc.
  permissions JSONB DEFAULT '{"can_edit": true, "can_delete": false, "can_invite": false}'::jsonb,
  joined_at TIMESTAMPTZ DEFAULT now(),
  invited_by UUID,
  UNIQUE(family_id, user_id)
);

-- Dashboard Configuration (Per-family customization)
CREATE TABLE public.family_dashboard_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL UNIQUE,
  visible_sections JSONB DEFAULT '["student_overview", "educator_logs", "progress_tracking"]'::jsonb,
  section_order JSONB DEFAULT '[1,2,3]'::jsonb,
  custom_metrics JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Educator Logs (Therapy, education, daily observations)
CREATE TABLE public.educator_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  log_type TEXT NOT NULL, -- 'therapy', 'classroom', 'observation', 'behavior'
  educator_name TEXT NOT NULL,
  educator_role TEXT, -- 'ABA Therapist', 'Special Ed Teacher', 'Speech Therapist', etc.
  session_duration_minutes INTEGER,
  activities_completed TEXT[],
  skills_worked_on TEXT[],
  behavioral_observations TEXT,
  progress_notes TEXT,
  challenges TEXT,
  goals_for_next_session TEXT,
  parent_communication TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Progress Metrics (Quantifiable data points)
CREATE TABLE public.progress_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  educator_log_id UUID REFERENCES public.educator_logs(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metric_category TEXT NOT NULL, -- 'academic', 'behavioral', 'communication', 'social', 'self_care'
  metric_name TEXT NOT NULL, -- 'Reading Level', 'Tantrum Frequency', 'Eye Contact Duration', etc.
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT, -- 'minutes', 'count', 'percentage', 'level'
  target_value NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_students_family ON public.students(family_id);
CREATE INDEX idx_family_members_user ON public.family_members(user_id);
CREATE INDEX idx_family_members_family ON public.family_members(family_id);
CREATE INDEX idx_educator_logs_family ON public.educator_logs(family_id);
CREATE INDEX idx_educator_logs_student ON public.educator_logs(student_id);
CREATE INDEX idx_educator_logs_date ON public.educator_logs(log_date DESC);
CREATE INDEX idx_progress_metrics_student ON public.progress_metrics(student_id);
CREATE INDEX idx_progress_metrics_date ON public.progress_metrics(metric_date DESC);

-- Enable Row Level Security
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_dashboard_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educator_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_metrics ENABLE ROW LEVEL SECURITY;

-- Security Definer Function: Check if user is a family member
CREATE OR REPLACE FUNCTION public.is_family_member(_user_id UUID, _family_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.family_members
    WHERE user_id = _user_id
      AND family_id = _family_id
  )
$$;

-- Security Definer Function: Check if user is family owner
CREATE OR REPLACE FUNCTION public.is_family_owner(_user_id UUID, _family_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.family_members
    WHERE user_id = _user_id
      AND family_id = _family_id
      AND role = 'owner'
  )
$$;

-- RLS Policies for families table
CREATE POLICY "Users can view families they belong to"
  ON public.families FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members
      WHERE family_members.family_id = families.id
        AND family_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own family"
  ON public.families FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Family owners can update their family"
  ON public.families FOR UPDATE
  USING (public.is_family_owner(auth.uid(), id));

-- RLS Policies for students table
CREATE POLICY "Family members can view students"
  ON public.students FOR SELECT
  USING (public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert students"
  ON public.students FOR INSERT
  WITH CHECK (public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can update students"
  ON public.students FOR UPDATE
  USING (public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family owners can delete students"
  ON public.students FOR DELETE
  USING (public.is_family_owner(auth.uid(), family_id));

-- RLS Policies for family_members table
CREATE POLICY "Users can view their own family memberships"
  ON public.family_members FOR SELECT
  USING (user_id = auth.uid() OR public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family owners can manage members"
  ON public.family_members FOR ALL
  USING (public.is_family_owner(auth.uid(), family_id));

-- RLS Policies for family_dashboard_config
CREATE POLICY "Family members can view dashboard config"
  ON public.family_dashboard_config FOR SELECT
  USING (public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can manage dashboard config"
  ON public.family_dashboard_config FOR ALL
  USING (public.is_family_member(auth.uid(), family_id));

-- RLS Policies for educator_logs
CREATE POLICY "Family members can view educator logs"
  ON public.educator_logs FOR SELECT
  USING (public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert educator logs"
  ON public.educator_logs FOR INSERT
  WITH CHECK (
    public.is_family_member(auth.uid(), family_id)
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update their own educator logs"
  ON public.educator_logs FOR UPDATE
  USING (created_by = auth.uid() AND public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family owners can delete educator logs"
  ON public.educator_logs FOR DELETE
  USING (public.is_family_owner(auth.uid(), family_id));

-- RLS Policies for progress_metrics
CREATE POLICY "Family members can view progress metrics"
  ON public.progress_metrics FOR SELECT
  USING (public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert progress metrics"
  ON public.progress_metrics FOR INSERT
  WITH CHECK (public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can update progress metrics"
  ON public.progress_metrics FOR UPDATE
  USING (public.is_family_member(auth.uid(), family_id));

CREATE POLICY "Family owners can delete progress metrics"
  ON public.progress_metrics FOR DELETE
  USING (public.is_family_owner(auth.uid(), family_id));

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON public.families
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_educator_logs_updated_at
  BEFORE UPDATE ON public.educator_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
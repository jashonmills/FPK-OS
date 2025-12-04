
-- Create enum types for organization system
CREATE TYPE public.org_subscription_tier AS ENUM ('basic', 'standard', 'premium');
CREATE TYPE public.note_visibility_scope AS ENUM ('student-only', 'instructor-visible', 'org-public');
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
CREATE TYPE public.member_role AS ENUM ('owner', 'instructor', 'student');
CREATE TYPE public.member_status AS ENUM ('active', 'paused', 'blocked', 'removed');

-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_tier org_subscription_tier NOT NULL DEFAULT 'basic',
  seat_limit INTEGER NOT NULL DEFAULT 3,
  seats_used INTEGER NOT NULL DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create org_members table for student-instructor relationships
CREATE TABLE public.org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role member_role NOT NULL DEFAULT 'student',
  status member_status NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ,
  removed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Create org_invitations table for email invitations and codes
CREATE TABLE public.org_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT,
  invitation_code TEXT UNIQUE,
  status invitation_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  accepted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create org_course_assignments table
CREATE TABLE public.org_course_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL, -- References courses.id
  assigned_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_ids UUID[] NOT NULL DEFAULT '{}', -- Array of student user IDs
  due_date TIMESTAMPTZ,
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create org_goals table with folder system
CREATE TABLE public.org_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  folder_path TEXT DEFAULT '/',
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create org_notes table with visibility controls
CREATE TABLE public.org_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  folder_path TEXT DEFAULT '/',
  visibility_scope note_visibility_scope NOT NULL DEFAULT 'instructor-visible',
  is_private BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create comprehensive audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'create', 'update', 'delete', 'view', 'assign', 'invite', 'impersonate'
  resource_type TEXT NOT NULL, -- 'student', 'goal', 'note', 'course', 'organization'
  resource_id UUID,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  justification TEXT, -- Required for sensitive admin actions
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add organization_id to existing tables
ALTER TABLE public.goals ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.notes ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.notes ADD COLUMN visibility_scope note_visibility_scope DEFAULT 'student-only';
ALTER TABLE public.notes ADD COLUMN is_private BOOLEAN DEFAULT false;

-- Create indexes for performance
CREATE INDEX idx_org_members_org_id ON public.org_members(organization_id);
CREATE INDEX idx_org_members_user_id ON public.org_members(user_id);
CREATE INDEX idx_org_members_status ON public.org_members(status);
CREATE INDEX idx_org_invitations_code ON public.org_invitations(invitation_code);
CREATE INDEX idx_org_invitations_email ON public.org_invitations(email);
CREATE INDEX idx_org_goals_student_id ON public.org_goals(student_id);
CREATE INDEX idx_org_goals_org_id ON public.org_goals(organization_id);
CREATE INDEX idx_org_notes_student_id ON public.org_notes(student_id);
CREATE INDEX idx_org_notes_org_id ON public.org_notes(organization_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_org_id ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS on all new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.user_is_org_owner(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.user_is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE organization_id = org_id AND user_id = auth.uid() AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.user_org_role(org_id UUID)
RETURNS member_role AS $$
BEGIN
  RETURN (
    SELECT role FROM public.org_members 
    WHERE organization_id = org_id AND user_id = auth.uid() AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations they own or are members of"
  ON public.organizations FOR SELECT
  USING (
    owner_id = auth.uid() OR 
    user_is_org_member(id) OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Users can create their own organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Organization owners can update their organizations"
  ON public.organizations FOR UPDATE
  USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for org_members
CREATE POLICY "Users can view members of organizations they belong to"
  ON public.org_members FOR SELECT
  USING (
    user_is_org_member(organization_id) OR 
    user_is_org_owner(organization_id) OR
    user_id = auth.uid() OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Organization owners can manage members"
  ON public.org_members FOR ALL
  USING (user_is_org_owner(organization_id) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (user_is_org_owner(organization_id) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for org_invitations  
CREATE POLICY "Users can view invitations for organizations they own"
  ON public.org_invitations FOR SELECT
  USING (
    user_is_org_owner(organization_id) OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Organization owners can create invitations"
  ON public.org_invitations FOR INSERT
  WITH CHECK (
    user_is_org_owner(organization_id) AND 
    invited_by = auth.uid()
  );

CREATE POLICY "Organization owners can update invitations"
  ON public.org_invitations FOR UPDATE
  USING (user_is_org_owner(organization_id) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for org_goals
CREATE POLICY "Users can view goals in organizations they belong to"
  ON public.org_goals FOR SELECT
  USING (
    student_id = auth.uid() OR
    user_is_org_owner(organization_id) OR
    (user_is_org_member(organization_id) AND user_org_role(organization_id) = 'instructor') OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Organization owners and instructors can manage goals"
  ON public.org_goals FOR ALL
  USING (
    user_is_org_owner(organization_id) OR
    (user_is_org_member(organization_id) AND user_org_role(organization_id) = 'instructor') OR
    has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    user_is_org_owner(organization_id) OR
    (user_is_org_member(organization_id) AND user_org_role(organization_id) = 'instructor') OR
    has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for org_notes
CREATE POLICY "Users can view notes based on visibility scope"
  ON public.org_notes FOR SELECT
  USING (
    -- Student can see their own notes if not private or if visibility allows
    (student_id = auth.uid() AND (NOT is_private OR visibility_scope IN ('student-only', 'instructor-visible', 'org-public'))) OR
    -- Organization owners can see all notes except private student-only ones
    (user_is_org_owner(organization_id) AND NOT (is_private AND visibility_scope = 'student-only')) OR
    -- Instructors can see instructor-visible and org-public notes
    (user_is_org_member(organization_id) AND user_org_role(organization_id) = 'instructor' AND visibility_scope IN ('instructor-visible', 'org-public')) OR
    -- Admins can see all with proper mode
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Organization owners and instructors can manage notes"
  ON public.org_notes FOR ALL
  USING (
    user_is_org_owner(organization_id) OR
    (user_is_org_member(organization_id) AND user_org_role(organization_id) = 'instructor') OR
    has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    user_is_org_owner(organization_id) OR
    (user_is_org_member(organization_id) AND user_org_role(organization_id) = 'instructor') OR
    has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for audit_logs
CREATE POLICY "Users can view audit logs for their organizations"
  ON public.audit_logs FOR SELECT
  USING (
    user_id = auth.uid() OR
    user_is_org_owner(organization_id) OR
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "System can create audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_members_updated_at
  BEFORE UPDATE ON public.org_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_invitations_updated_at
  BEFORE UPDATE ON public.org_invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_goals_updated_at
  BEFORE UPDATE ON public.org_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_org_notes_updated_at
  BEFORE UPDATE ON public.org_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique invitation codes
CREATE OR REPLACE FUNCTION public.generate_invitation_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically update seat usage
CREATE OR REPLACE FUNCTION public.update_org_seat_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Update seat usage for the organization
  UPDATE public.organizations 
  SET seats_used = (
    SELECT COUNT(*) 
    FROM public.org_members 
    WHERE organization_id = COALESCE(NEW.organization_id, OLD.organization_id) 
    AND status = 'active'
    AND role = 'student'
  )
  WHERE id = COALESCE(NEW.organization_id, OLD.organization_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seat_usage_on_member_change
  AFTER INSERT OR UPDATE OR DELETE ON public.org_members
  FOR EACH ROW EXECUTE FUNCTION public.update_org_seat_usage();

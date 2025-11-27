-- Create student course assignments table
CREATE TABLE public.student_course_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  org_id UUID NOT NULL,
  assigned_by UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'paused')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id, org_id)
);

-- Create student notes table
CREATE TABLE public.student_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  org_id UUID NOT NULL,
  author_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  note_type TEXT NOT NULL DEFAULT 'general' CHECK (note_type IN ('general', 'academic', 'behavioral', 'administrative', 'medical')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_private BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student messages table
CREATE TABLE public.student_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  org_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'internal' CHECK (message_type IN ('internal', 'announcement', 'system')),
  parent_message_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student attachments table
CREATE TABLE public.student_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  org_id UUID NOT NULL,
  uploaded_by UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  attachment_type TEXT NOT NULL DEFAULT 'document' CHECK (attachment_type IN ('document', 'image', 'transcript', 'certificate', 'medical', 'form')),
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student activity log table
CREATE TABLE public.student_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  org_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'logout', 'course_access', 'assignment_submit', 'message_read', 'profile_update', 'course_complete')),
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student performance metrics table
CREATE TABLE public.student_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  org_id UUID NOT NULL,
  course_id TEXT,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('grade', 'attendance', 'engagement', 'completion_rate', 'time_spent')),
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  max_value NUMERIC,
  unit TEXT,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  recorded_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.student_course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for student_course_assignments
CREATE POLICY "Users can view assignments in their org" ON public.student_course_assignments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_course_assignments.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active'
  )
);

CREATE POLICY "Org leaders can manage course assignments" ON public.student_course_assignments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_course_assignments.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active' 
    AND om.role IN ('owner', 'instructor')
  )
);

-- Create RLS policies for student_notes
CREATE POLICY "Users can view notes in their org" ON public.student_notes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_notes.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active'
  )
);

CREATE POLICY "Org leaders can manage student notes" ON public.student_notes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_notes.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active' 
    AND om.role IN ('owner', 'instructor')
  )
);

-- Create RLS policies for student_messages
CREATE POLICY "Users can view messages in their org" ON public.student_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_messages.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active'
  ) OR sender_id = auth.uid() OR recipient_id = auth.uid()
);

CREATE POLICY "Org members can send messages" ON public.student_messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_messages.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active'
  ) AND sender_id = auth.uid()
);

CREATE POLICY "Users can update their own messages" ON public.student_messages
FOR UPDATE USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Create RLS policies for student_attachments
CREATE POLICY "Users can view attachments in their org" ON public.student_attachments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_attachments.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active'
  )
);

CREATE POLICY "Org leaders can manage attachments" ON public.student_attachments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_attachments.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active' 
    AND om.role IN ('owner', 'instructor')
  )
);

-- Create RLS policies for student_activity_log
CREATE POLICY "Users can view activity in their org" ON public.student_activity_log
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_activity_log.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active'
  )
);

CREATE POLICY "System can create activity logs" ON public.student_activity_log
FOR INSERT WITH CHECK (true);

-- Create RLS policies for student_performance_metrics
CREATE POLICY "Users can view performance metrics in their org" ON public.student_performance_metrics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_performance_metrics.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active'
  )
);

CREATE POLICY "Org leaders can manage performance metrics" ON public.student_performance_metrics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.org_members om 
    WHERE om.org_id = student_performance_metrics.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active' 
    AND om.role IN ('owner', 'instructor')
  )
);

-- Create indexes for better performance
CREATE INDEX idx_student_course_assignments_student_id ON public.student_course_assignments(student_id);
CREATE INDEX idx_student_course_assignments_org_id ON public.student_course_assignments(org_id);
CREATE INDEX idx_student_course_assignments_course_id ON public.student_course_assignments(course_id);
CREATE INDEX idx_student_course_assignments_status ON public.student_course_assignments(status);

CREATE INDEX idx_student_notes_student_id ON public.student_notes(student_id);
CREATE INDEX idx_student_notes_org_id ON public.student_notes(org_id);
CREATE INDEX idx_student_notes_author_id ON public.student_notes(author_id);
CREATE INDEX idx_student_notes_note_type ON public.student_notes(note_type);

CREATE INDEX idx_student_messages_student_id ON public.student_messages(student_id);
CREATE INDEX idx_student_messages_org_id ON public.student_messages(org_id);
CREATE INDEX idx_student_messages_sender_id ON public.student_messages(sender_id);
CREATE INDEX idx_student_messages_recipient_id ON public.student_messages(recipient_id);

CREATE INDEX idx_student_attachments_student_id ON public.student_attachments(student_id);
CREATE INDEX idx_student_attachments_org_id ON public.student_attachments(org_id);

CREATE INDEX idx_student_activity_log_student_id ON public.student_activity_log(student_id);
CREATE INDEX idx_student_activity_log_org_id ON public.student_activity_log(org_id);
CREATE INDEX idx_student_activity_log_activity_type ON public.student_activity_log(activity_type);

CREATE INDEX idx_student_performance_metrics_student_id ON public.student_performance_metrics(student_id);
CREATE INDEX idx_student_performance_metrics_org_id ON public.student_performance_metrics(org_id);
CREATE INDEX idx_student_performance_metrics_course_id ON public.student_performance_metrics(course_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_student_course_assignments_updated_at
  BEFORE UPDATE ON public.student_course_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_notes_updated_at
  BEFORE UPDATE ON public.student_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_messages_updated_at
  BEFORE UPDATE ON public.student_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_attachments_updated_at
  BEFORE UPDATE ON public.student_attachments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_performance_metrics_updated_at
  BEFORE UPDATE ON public.student_performance_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
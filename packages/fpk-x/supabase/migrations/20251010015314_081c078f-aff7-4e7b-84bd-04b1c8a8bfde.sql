-- ==================================================
-- PART A: DOCUMENT MANAGEMENT SYSTEM TABLES
-- ==================================================

-- 1. DOCUMENTS TABLE: Stores file metadata
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_type TEXT,
  file_size_kb INTEGER,
  category TEXT DEFAULT 'general',
  document_date DATE,
  extracted_content TEXT,
  last_analyzed_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_documents_family_id ON public.documents(family_id);
CREATE INDEX idx_documents_student_id ON public.documents(student_id);

-- 2. DOCUMENT_METRICS TABLE: Stores structured data extracted by AI
CREATE TABLE public.document_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_unit TEXT,
  target_value NUMERIC,
  measurement_date DATE,
  duration_minutes NUMERIC,
  start_time TEXT,
  end_time TEXT,
  context TEXT,
  intervention_used TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_document_metrics_document_id ON public.document_metrics(document_id);
CREATE INDEX idx_document_metrics_student_id ON public.document_metrics(student_id);

-- 3. AI_INSIGHTS TABLE: Stores qualitative insights from AI
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  confidence_score NUMERIC,
  is_active BOOLEAN DEFAULT true,
  generated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ai_insights_student_id ON public.ai_insights(student_id);
CREATE INDEX idx_ai_insights_priority ON public.ai_insights(priority) WHERE is_active = true;

-- 4. PROGRESS_TRACKING TABLE: Stores longitudinal goal progress
CREATE TABLE public.progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  baseline_value NUMERIC,
  current_value NUMERIC,
  target_value NUMERIC,
  progress_percentage NUMERIC,
  trend TEXT,
  period_start DATE,
  period_end DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_progress_tracking_student_id ON public.progress_tracking(student_id);

-- 5. DOCUMENT_COMPARISONS TABLE: For year-over-year analysis
CREATE TABLE public.document_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_id_a UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  document_id_b UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  comparison_summary TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================================================
-- USER ROLES SYSTEM (CRITICAL FOR SECURITY)
-- ==================================================

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- ==================================================
-- PART B: KNOWLEDGE BASE TABLES
-- ==================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. KNOWLEDGE_BASE TABLE: Stores source document metadata
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_url TEXT UNIQUE,
  title TEXT,
  publication_date DATE,
  document_type TEXT NOT NULL,
  keywords TEXT[],
  focus_areas TEXT[] DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_kb_focus_areas ON public.knowledge_base USING GIN(focus_areas);

-- 2. KB_CHUNKS TABLE: Stores vectorized text chunks
CREATE TABLE public.kb_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kb_id UUID NOT NULL REFERENCES public.knowledge_base(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create IVFFlat index for fast similarity search
CREATE INDEX idx_kb_chunks_embedding ON public.kb_chunks USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- ==================================================
-- ENABLE RLS ON ALL NEW TABLES
-- ==================================================
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_chunks ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- RLS POLICIES
-- ==================================================

-- Documents RLS
CREATE POLICY "Family members can manage their documents" ON public.documents
  FOR ALL USING (public.is_family_member(auth.uid(), family_id))
  WITH CHECK (public.is_family_member(auth.uid(), family_id));

-- Document Metrics RLS
CREATE POLICY "Family members can manage document metrics" ON public.document_metrics
  FOR ALL USING (public.is_family_member(auth.uid(), family_id))
  WITH CHECK (public.is_family_member(auth.uid(), family_id));

-- AI Insights RLS
CREATE POLICY "Family members can manage AI insights" ON public.ai_insights
  FOR ALL USING (public.is_family_member(auth.uid(), family_id))
  WITH CHECK (public.is_family_member(auth.uid(), family_id));

-- Progress Tracking RLS
CREATE POLICY "Family members can manage progress tracking" ON public.progress_tracking
  FOR ALL USING (public.is_family_member(auth.uid(), family_id))
  WITH CHECK (public.is_family_member(auth.uid(), family_id));

-- Document Comparisons RLS
CREATE POLICY "Family members can manage document comparisons" ON public.document_comparisons
  FOR ALL USING (public.is_family_member(auth.uid(), family_id))
  WITH CHECK (public.is_family_member(auth.uid(), family_id));

-- User Roles RLS
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Knowledge Base RLS (Admin only)
CREATE POLICY "Admins can manage knowledge base" ON public.knowledge_base
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can read knowledge base" ON public.knowledge_base
  FOR SELECT USING (true);

-- KB Chunks RLS (Admin only for writes, everyone can read)
CREATE POLICY "Admins can manage kb chunks" ON public.kb_chunks
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete kb chunks" ON public.kb_chunks
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can read kb chunks" ON public.kb_chunks
  FOR SELECT USING (true);

-- ==================================================
-- STORAGE BUCKET SETUP
-- ==================================================

-- Create the private family-documents bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('family-documents', 'family-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policy for SELECT (Downloads)
CREATE POLICY "Family members can view their own files"
  ON storage.objects FOR SELECT
  USING ( 
    bucket_id = 'family-documents' AND 
    (storage.foldername(name))[1] IN (
      SELECT f.id::text 
      FROM public.families f 
      JOIN public.family_members fm ON f.id = fm.family_id 
      WHERE fm.user_id = auth.uid()
    )
  );

-- Storage RLS Policy for INSERT (Uploads)
CREATE POLICY "Family members can upload to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK ( 
    bucket_id = 'family-documents' AND 
    (storage.foldername(name))[1] IN (
      SELECT f.id::text 
      FROM public.families f 
      JOIN public.family_members fm ON f.id = fm.family_id 
      WHERE fm.user_id = auth.uid()
    )
  );

-- Storage RLS Policy for DELETE
CREATE POLICY "Family members can delete their own files"
  ON storage.objects FOR DELETE
  USING ( 
    bucket_id = 'family-documents' AND 
    (storage.foldername(name))[1] IN (
      SELECT f.id::text 
      FROM public.families f 
      JOIN public.family_members fm ON f.id = fm.family_id 
      WHERE fm.user_id = auth.uid()
    )
  );

-- Storage RLS Policy for UPDATE
CREATE POLICY "Family members can update their own files"
  ON storage.objects FOR UPDATE
  USING ( 
    bucket_id = 'family-documents' AND 
    (storage.foldername(name))[1] IN (
      SELECT f.id::text 
      FROM public.families f 
      JOIN public.family_members fm ON f.id = fm.family_id 
      WHERE fm.user_id = auth.uid()
    )
  );
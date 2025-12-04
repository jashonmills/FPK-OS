-- Phase 1: Add family_id to knowledge base tables

-- Add family_id to knowledge_base table
ALTER TABLE public.knowledge_base
ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id) ON DELETE CASCADE;

-- Add family_id to kb_chunks table
ALTER TABLE public.kb_chunks
ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id) ON DELETE CASCADE;

-- Add family_id to ingestion_jobs table
ALTER TABLE public.ingestion_jobs
ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id) ON DELETE CASCADE;

-- Add family_id to ingestion_errors table
ALTER TABLE public.ingestion_errors
ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.families(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_base_family_id ON public.knowledge_base(family_id);
CREATE INDEX IF NOT EXISTS idx_kb_chunks_family_id ON public.kb_chunks(family_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_family_id ON public.ingestion_jobs(family_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_errors_family_id ON public.ingestion_errors(family_id);

-- Phase 2: Update RLS Policies for strict family isolation

-- Drop existing policies on knowledge_base
DROP POLICY IF EXISTS "Admins can manage knowledge base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Everyone can read knowledge base" ON public.knowledge_base;

-- Create family-scoped policies for knowledge_base
CREATE POLICY "Family members can view their knowledge base"
  ON public.knowledge_base
  FOR SELECT
  USING (
    family_id IS NULL OR -- Allow global KB entries (admin-created)
    is_family_member(auth.uid(), family_id)
  );

CREATE POLICY "Family owners can insert to their knowledge base"
  ON public.knowledge_base
  FOR INSERT
  WITH CHECK (
    is_family_owner(auth.uid(), family_id) OR
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all knowledge base"
  ON public.knowledge_base
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Drop existing policies on kb_chunks
DROP POLICY IF EXISTS "Admins can manage kb chunks" ON public.kb_chunks;
DROP POLICY IF EXISTS "Admins can delete kb chunks" ON public.kb_chunks;
DROP POLICY IF EXISTS "Everyone can read kb chunks" ON public.kb_chunks;

-- Create family-scoped policies for kb_chunks
CREATE POLICY "Family members can view their kb chunks"
  ON public.kb_chunks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.knowledge_base kb
      WHERE kb.id = kb_chunks.kb_id
      AND (kb.family_id IS NULL OR is_family_member(auth.uid(), kb.family_id))
    )
  );

CREATE POLICY "Family owners can insert their kb chunks"
  ON public.kb_chunks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.knowledge_base kb
      WHERE kb.id = kb_chunks.kb_id
      AND (is_family_owner(auth.uid(), kb.family_id) OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Admins can manage all kb chunks"
  ON public.kb_chunks
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Update ingestion_jobs policies
DROP POLICY IF EXISTS "Admins can manage ingestion jobs" ON public.ingestion_jobs;

CREATE POLICY "Family owners can view their ingestion jobs"
  ON public.ingestion_jobs
  FOR SELECT
  USING (
    is_family_owner(auth.uid(), family_id) OR
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Family owners can create their ingestion jobs"
  ON public.ingestion_jobs
  FOR INSERT
  WITH CHECK (
    is_family_owner(auth.uid(), family_id) OR
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "System can update ingestion jobs"
  ON public.ingestion_jobs
  FOR UPDATE
  USING (true);

CREATE POLICY "Admins can delete ingestion jobs"
  ON public.ingestion_jobs
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Update ingestion_errors policies
DROP POLICY IF EXISTS "Admins can manage ingestion errors" ON public.ingestion_errors;

CREATE POLICY "Family owners can view their ingestion errors"
  ON public.ingestion_errors
  FOR SELECT
  USING (
    is_family_owner(auth.uid(), family_id) OR
    has_role(auth.uid(), 'admin')
  );

CREATE POLICY "System can insert ingestion errors"
  ON public.ingestion_errors
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can delete ingestion errors"
  ON public.ingestion_errors
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));
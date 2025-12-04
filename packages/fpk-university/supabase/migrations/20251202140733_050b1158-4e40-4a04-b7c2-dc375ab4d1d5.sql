-- Create org_knowledge_base table for organization documents
CREATE TABLE public.org_knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'pdf', 'docx', 'txt', 'md'
  file_url TEXT, -- Storage URL if uploaded
  content TEXT NOT NULL, -- Extracted text content
  content_chunks JSONB DEFAULT '[]', -- Pre-chunked for RAG
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.org_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Org members can view knowledge base
CREATE POLICY "Org members can view knowledge base"
  ON public.org_knowledge_base FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_knowledge_base.org_id
      AND om.user_id = auth.uid()
    )
  );

-- Only admins can manage knowledge base
CREATE POLICY "Org admins can insert knowledge base"
  ON public.org_knowledge_base FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_knowledge_base.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Org admins can update knowledge base"
  ON public.org_knowledge_base FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_knowledge_base.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Org admins can delete knowledge base"
  ON public.org_knowledge_base FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members om
      WHERE om.org_id = org_knowledge_base.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_org_knowledge_base_updated_at
  BEFORE UPDATE ON public.org_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for org lookups
CREATE INDEX idx_org_knowledge_base_org ON public.org_knowledge_base(org_id) WHERE is_active = true;
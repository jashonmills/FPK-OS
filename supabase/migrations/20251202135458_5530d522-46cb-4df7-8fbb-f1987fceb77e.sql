-- Phase 1: AI Tool Model Assignments
-- Maps which model each tool uses, with org-level overrides

CREATE TABLE public.ai_tool_model_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  model_config_id UUID NOT NULL REFERENCES public.ai_governance_model_configs(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(org_id, tool_id)
);

-- Index for fast lookups
CREATE INDEX idx_tool_model_assignments_org_tool ON public.ai_tool_model_assignments(org_id, tool_id);
CREATE INDEX idx_tool_model_assignments_tool ON public.ai_tool_model_assignments(tool_id);

-- Enable RLS
ALTER TABLE public.ai_tool_model_assignments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage tool model assignments"
ON public.ai_tool_model_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
  OR
  EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE user_id = auth.uid() 
    AND org_id = ai_tool_model_assignments.org_id 
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
);

CREATE POLICY "Users can view their org assignments"
ON public.ai_tool_model_assignments
FOR SELECT
USING (
  org_id IS NULL 
  OR EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE user_id = auth.uid() 
    AND org_id = ai_tool_model_assignments.org_id
    AND status = 'active'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_ai_tool_model_assignments_updated_at
  BEFORE UPDATE ON public.ai_tool_model_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_tools_updated_at();

-- Insert default global assignments (null org_id = platform default)
-- Map each tool to a default model
INSERT INTO public.ai_tool_model_assignments (org_id, tool_id, model_config_id)
SELECT 
  NULL as org_id,
  t.id as tool_id,
  (SELECT id FROM public.ai_governance_model_configs WHERE model_id = 'gemini-2.5-flash' LIMIT 1) as model_config_id
FROM public.ai_tools t
WHERE EXISTS (SELECT 1 FROM public.ai_governance_model_configs WHERE model_id = 'gemini-2.5-flash')
ON CONFLICT DO NOTHING;
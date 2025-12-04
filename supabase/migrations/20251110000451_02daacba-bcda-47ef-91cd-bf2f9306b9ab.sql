-- Add missing org_id column to ai_coach_study_materials
ALTER TABLE public.ai_coach_study_materials
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_study_materials_org_id ON public.ai_coach_study_materials(org_id);
-- ============================================
-- OPERATION FIRST LIGHT: BILINGUAL DATABASE LAYER
-- Phase 0: Update Goals Table Schema
-- ============================================

-- Add missing columns to goals table
ALTER TABLE public.goals
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id),
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ALTER COLUMN student_id DROP NOT NULL,
  ALTER COLUMN family_id DROP NOT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_goals_client_id ON public.goals(client_id);
CREATE INDEX IF NOT EXISTS idx_goals_organization_id ON public.goals(organization_id);

-- Update RLS policies for goals to support both models
DROP POLICY IF EXISTS "Users can view goals for their family" ON public.goals;
DROP POLICY IF EXISTS "Users can create goals for their family" ON public.goals;
DROP POLICY IF EXISTS "Users can update goals for their family" ON public.goals;
DROP POLICY IF EXISTS "Users can delete goals for their family" ON public.goals;

CREATE POLICY "Users can view goals for their family or org"
  ON public.goals
  FOR SELECT
  USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND is_active = true)
    OR client_id IN (SELECT client_id FROM public.client_access WHERE status = 'active' AND (
      family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
      OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND is_active = true)
    ))
  );

CREATE POLICY "Users can create goals for their family or org"
  ON public.goals
  FOR INSERT
  WITH CHECK (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND is_active = true)
    OR client_id IN (SELECT client_id FROM public.client_access WHERE status = 'active' AND (
      family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
      OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND is_active = true)
    ))
  );

CREATE POLICY "Users can update goals for their family or org"
  ON public.goals
  FOR UPDATE
  USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND is_active = true)
    OR client_id IN (SELECT client_id FROM public.client_access WHERE status = 'active' AND (
      family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
      OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND is_active = true)
    ))
  );

CREATE POLICY "Users can delete goals for their family or org"
  ON public.goals
  FOR DELETE
  USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND is_active = true)
    OR client_id IN (SELECT client_id FROM public.client_access WHERE status = 'active' AND (
      family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
      OR organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid() AND is_active = true)
    ))
  );
-- Add potential_triggers column to incident_logs for AI trigger analysis
ALTER TABLE public.incident_logs
ADD COLUMN IF NOT EXISTS potential_triggers JSONB;

-- Add addressed_goal_ids to educator_logs for IEP goal tracking
ALTER TABLE public.educator_logs
ADD COLUMN IF NOT EXISTS addressed_goal_ids UUID[];

-- Create intervention_outcomes table for strategy success tracking
CREATE TABLE IF NOT EXISTS public.intervention_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  intervention_name TEXT NOT NULL,
  incident_id UUID NOT NULL REFERENCES public.incident_logs(id) ON DELETE CASCADE,
  outcome_success BOOLEAN NOT NULL,
  de_escalation_time_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.intervention_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can manage intervention outcomes" 
ON public.intervention_outcomes
FOR ALL 
USING (public.is_family_member(auth.uid(), family_id))
WITH CHECK (public.is_family_member(auth.uid(), family_id));
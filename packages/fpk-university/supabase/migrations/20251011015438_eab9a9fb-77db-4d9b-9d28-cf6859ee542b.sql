-- Add tour tracking columns to org_members table
ALTER TABLE public.org_members
ADD COLUMN IF NOT EXISTS has_seen_dashboard_tour boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_seen_students_tour boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_seen_groups_tour boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_seen_courses_tour boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_seen_iep_tour boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_seen_goals_notes_tour boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_seen_ai_assistant_tour boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_seen_settings_tour boolean DEFAULT false;

-- Create function to update tour completion
CREATE OR REPLACE FUNCTION public.mark_tour_complete(
  p_org_id uuid,
  p_user_id uuid,
  p_tour_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE format(
    'UPDATE public.org_members SET %I = true WHERE org_id = $1 AND user_id = $2',
    'has_seen_' || p_tour_name || '_tour'
  ) USING p_org_id, p_user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.mark_tour_complete TO authenticated;
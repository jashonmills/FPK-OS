-- Add messaging_enabled column to org_groups
ALTER TABLE public.org_groups
ADD COLUMN IF NOT EXISTS messaging_enabled BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.org_groups.messaging_enabled IS 
  'When true, student members of this group can DM each other directly.';

-- Helper Function: Get User Role in Org
CREATE OR REPLACE FUNCTION public.get_org_user_role(p_user_id uuid, p_org_id uuid)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.org_members
  WHERE user_id = p_user_id AND org_id = p_org_id AND status = 'active';
  
  RETURN COALESCE(user_role, 'none');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Helper Function: Check if User is an Educator in Org
CREATE OR REPLACE FUNCTION public.is_org_educator(p_user_id uuid, p_org_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members
    WHERE user_id = p_user_id 
      AND org_id = p_org_id 
      AND status = 'active'
      AND role IN ('owner', 'admin', 'instructor', 'instructor_aide')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Helper Function: Check if two students can message each other
CREATE OR REPLACE FUNCTION public.can_students_message(p_org_id uuid, p_student1_id uuid, p_student2_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if both students share at least one messaging-enabled group in the org
  RETURN EXISTS (
    SELECT 1
    FROM public.org_groups g
    WHERE g.org_id = p_org_id
      AND g.messaging_enabled = true
      AND EXISTS (
        SELECT 1 FROM public.org_group_members gm1
        WHERE gm1.group_id = g.id AND gm1.user_id = p_student1_id
      )
      AND EXISTS (
        SELECT 1 FROM public.org_group_members gm2
        WHERE gm2.group_id = g.id AND gm2.user_id = p_student2_id
      )
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
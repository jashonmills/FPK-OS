-- Add missing columns to org_group_members table without primary key
ALTER TABLE public.org_group_members 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS added_by UUID,
ADD COLUMN IF NOT EXISTS added_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index on id column for better performance
CREATE INDEX IF NOT EXISTS idx_org_group_members_id ON public.org_group_members(id);

-- Now create the policies that were failing before
DROP POLICY IF EXISTS "Group members can view group membership" ON public.org_group_members;
DROP POLICY IF EXISTS "Org instructors can add group members" ON public.org_group_members;
DROP POLICY IF EXISTS "Org instructors can remove group members" ON public.org_group_members;

-- Create policies for org_group_members
CREATE POLICY "Group members can view group membership" ON public.org_group_members
FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.org_groups og
    JOIN public.org_members om ON om.org_id = og.org_id
    WHERE og.id = org_group_members.group_id
    AND om.user_id = auth.uid()
    AND om.status = 'active'
  )
);

CREATE POLICY "Org instructors can add group members" ON public.org_group_members
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_groups og
    JOIN public.org_members om ON om.org_id = og.org_id
    WHERE og.id = org_group_members.group_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'instructor')
    AND om.status = 'active'
  )
);

CREATE POLICY "Org instructors can remove group members" ON public.org_group_members
FOR DELETE USING (
  added_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.org_groups og
    JOIN public.org_members om ON om.org_id = og.org_id
    WHERE og.id = org_group_members.group_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'instructor')
    AND om.status = 'active'
  )
);
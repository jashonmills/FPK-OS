-- Add missing columns to org_group_members table
ALTER TABLE public.org_group_members 
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
ADD COLUMN IF NOT EXISTS added_by UUID,
ADD COLUMN IF NOT EXISTS added_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create policies for org_group_members (they were failing before due to missing columns)
DROP POLICY IF EXISTS "Group members can view group membership" ON public.org_group_members;
DROP POLICY IF EXISTS "Org instructors can add group members" ON public.org_group_members;
DROP POLICY IF EXISTS "Org instructors can remove group members" ON public.org_group_members;

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
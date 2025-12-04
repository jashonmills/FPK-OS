-- Add missing columns to org_groups table
ALTER TABLE public.org_groups 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create org_group_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.org_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.org_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  added_by UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate memberships
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'unique_group_member'
  ) THEN
    ALTER TABLE public.org_group_members 
    ADD CONSTRAINT unique_group_member UNIQUE (group_id, user_id);
  END IF;
END $$;

-- Enable RLS on both tables if not already enabled
ALTER TABLE public.org_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_group_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Org members can view org groups" ON public.org_groups;
DROP POLICY IF EXISTS "Org instructors can create groups" ON public.org_groups;
DROP POLICY IF EXISTS "Group creators can update groups" ON public.org_groups;
DROP POLICY IF EXISTS "Group creators can delete groups" ON public.org_groups;
DROP POLICY IF EXISTS "Group members can view group membership" ON public.org_group_members;
DROP POLICY IF EXISTS "Org instructors can add group members" ON public.org_group_members;
DROP POLICY IF EXISTS "Org instructors can remove group members" ON public.org_group_members;

-- RLS policies for org_groups
CREATE POLICY "Org members can view org groups" ON public.org_groups
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_groups.org_id 
    AND om.user_id = auth.uid() 
    AND om.status = 'active'
  )
);

CREATE POLICY "Org instructors can create groups" ON public.org_groups
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_groups.org_id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('owner', 'instructor')
    AND om.status = 'active'
  )
);

CREATE POLICY "Group creators can update groups" ON public.org_groups
FOR UPDATE USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_groups.org_id 
    AND om.user_id = auth.uid() 
    AND om.role = 'owner'
    AND om.status = 'active'
  )
);

CREATE POLICY "Group creators can delete groups" ON public.org_groups  
FOR DELETE USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.org_members om
    WHERE om.org_id = org_groups.org_id 
    AND om.user_id = auth.uid() 
    AND om.role = 'owner'
    AND om.status = 'active'
  )
);

-- RLS policies for org_group_members
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

-- Create or replace trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_org_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_org_groups_updated_at ON public.org_groups;
CREATE TRIGGER update_org_groups_updated_at
BEFORE UPDATE ON public.org_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_org_groups_updated_at();
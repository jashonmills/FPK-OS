-- Create enum for space roles
CREATE TYPE public.space_role AS ENUM ('admin', 'editor', 'commenter', 'viewer');

-- Create space_permissions table
CREATE TABLE IF NOT EXISTS public.space_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id UUID NOT NULL REFERENCES public.doc_spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.space_role NOT NULL DEFAULT 'viewer',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(space_id, user_id)
);

-- Enable RLS
ALTER TABLE public.space_permissions ENABLE ROW LEVEL SECURITY;

-- Users can view permissions for spaces they have access to
CREATE POLICY "Users can view space permissions they have access to"
  ON public.space_permissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.doc_spaces
      WHERE doc_spaces.id = space_permissions.space_id
      AND (
        doc_spaces.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.space_permissions sp
          WHERE sp.space_id = doc_spaces.id
          AND sp.user_id = auth.uid()
        )
      )
    )
  );

-- Space admins can manage permissions
CREATE POLICY "Space admins can manage permissions"
  ON public.space_permissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.space_permissions
      WHERE space_id = space_permissions.space_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM public.doc_spaces
      WHERE id = space_permissions.space_id
      AND created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.space_permissions sp
      WHERE sp.space_id = space_permissions.space_id
      AND sp.user_id = auth.uid()
      AND sp.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM public.doc_spaces ds
      WHERE ds.id = space_permissions.space_id
      AND ds.created_by = auth.uid()
    )
  );

-- Add is_public column to doc_spaces
ALTER TABLE public.doc_spaces
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_personal BOOLEAN DEFAULT false;

-- Create helper function to check space access
CREATE OR REPLACE FUNCTION public.has_space_access(_user_id uuid, _space_id uuid, _required_role public.space_role DEFAULT 'viewer')
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.doc_spaces ds
    WHERE ds.id = _space_id
    AND (
      -- Owner has full access
      ds.created_by = _user_id
      -- Public spaces are viewable by all
      OR (ds.is_public = true AND _required_role = 'viewer')
      -- Check explicit permissions
      OR EXISTS (
        SELECT 1 FROM public.space_permissions sp
        WHERE sp.space_id = _space_id
        AND sp.user_id = _user_id
        AND (
          -- Admin can do everything
          sp.role = 'admin'
          -- Editor can edit
          OR (sp.role = 'editor' AND _required_role IN ('viewer', 'commenter', 'editor'))
          -- Commenter can comment and view
          OR (sp.role = 'commenter' AND _required_role IN ('viewer', 'commenter'))
          -- Viewer can only view
          OR (sp.role = 'viewer' AND _required_role = 'viewer')
        )
      )
      -- Project members have access to project spaces
      OR (
        ds.project_id IS NOT NULL
        AND is_project_member(_user_id, ds.project_id)
      )
    )
  )
$$;

-- Update RLS policies on doc_spaces to use the new function
DROP POLICY IF EXISTS "Users can view spaces" ON public.doc_spaces;
CREATE POLICY "Users can view spaces"
  ON public.doc_spaces
  FOR SELECT
  USING (has_space_access(auth.uid(), id, 'viewer'));

DROP POLICY IF EXISTS "Users can update spaces they created" ON public.doc_spaces;
CREATE POLICY "Users can update spaces"
  ON public.doc_spaces
  FOR UPDATE
  USING (has_space_access(auth.uid(), id, 'admin'));

DROP POLICY IF EXISTS "Users can delete spaces they created" ON public.doc_spaces;
CREATE POLICY "Users can delete spaces"
  ON public.doc_spaces
  FOR DELETE
  USING (has_space_access(auth.uid(), id, 'admin'));

-- Update RLS policies on doc_pages to respect space permissions
DROP POLICY IF EXISTS "Users can view pages" ON public.doc_pages;
CREATE POLICY "Users can view pages"
  ON public.doc_pages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.doc_spaces
      WHERE doc_spaces.id = doc_pages.space_id
      AND has_space_access(auth.uid(), doc_spaces.id, 'viewer')
    )
  );

DROP POLICY IF EXISTS "Users can update pages" ON public.doc_pages;
CREATE POLICY "Users can update pages"
  ON public.doc_pages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.doc_spaces
      WHERE doc_spaces.id = doc_pages.space_id
      AND has_space_access(auth.uid(), doc_spaces.id, 'editor')
    )
  );

DROP POLICY IF EXISTS "Users can delete their own pages" ON public.doc_pages;
CREATE POLICY "Users can delete pages"
  ON public.doc_pages
  FOR DELETE
  USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM public.doc_spaces
      WHERE doc_spaces.id = doc_pages.space_id
      AND has_space_access(auth.uid(), doc_spaces.id, 'admin')
    )
  );

-- Create trigger to auto-create personal space for new users
CREATE OR REPLACE FUNCTION public.create_personal_space()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Get user's name from profile
  SELECT full_name INTO user_name
  FROM public.profiles
  WHERE id = NEW.id;
  
  -- Create personal space
  INSERT INTO public.doc_spaces (
    name,
    description,
    icon,
    created_by,
    is_personal,
    is_public
  ) VALUES (
    COALESCE(user_name || '''s', 'My') || ' Notebook',
    'Your personal documentation space',
    '🔒',
    NEW.id,
    true,
    false
  );
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_user_profile_created ON public.profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_personal_space();

-- Create trigger to auto-grant space admin to creator
CREATE OR REPLACE FUNCTION public.grant_creator_space_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Don't auto-grant for personal spaces (owner is implicit admin)
  IF NEW.is_personal = false THEN
    INSERT INTO public.space_permissions (space_id, user_id, role, granted_by)
    VALUES (NEW.id, NEW.created_by, 'admin', NEW.created_by)
    ON CONFLICT (space_id, user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_space_created
  AFTER INSERT ON public.doc_spaces
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_creator_space_admin();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_space_permissions_space_id ON public.space_permissions(space_id);
CREATE INDEX IF NOT EXISTS idx_space_permissions_user_id ON public.space_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_spaces_project_id ON public.doc_spaces(project_id);
CREATE INDEX IF NOT EXISTS idx_doc_spaces_is_personal ON public.doc_spaces(is_personal);
CREATE INDEX IF NOT EXISTS idx_doc_spaces_is_public ON public.doc_spaces(is_public);
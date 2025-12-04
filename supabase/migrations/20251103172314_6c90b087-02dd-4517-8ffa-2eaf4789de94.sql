-- Create trigger to auto-create documentation space for new projects
CREATE OR REPLACE FUNCTION public.create_project_space()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_space_id UUID;
BEGIN
  -- Create documentation space for the project
  INSERT INTO public.doc_spaces (
    name,
    description,
    icon,
    created_by,
    project_id,
    is_public,
    is_personal
  ) VALUES (
    NEW.name || ' Docs',
    'Documentation for ' || NEW.name || ' project',
    '📦',
    auth.uid(),
    NEW.id,
    false,
    false
  )
  RETURNING id INTO new_space_id;
  
  -- Grant admin access to all existing project members
  INSERT INTO public.space_permissions (space_id, user_id, role, granted_by)
  SELECT 
    new_space_id,
    pm.user_id,
    CASE 
      WHEN pm.role = 'manager' THEN 'admin'::space_role
      ELSE 'editor'::space_role
    END,
    auth.uid()
  FROM public.project_members pm
  WHERE pm.project_id = NEW.id
  ON CONFLICT (space_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_project_created
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.create_project_space();

-- Create trigger to sync project member changes to space permissions
CREATE OR REPLACE FUNCTION public.sync_project_member_to_space()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  project_space_id UUID;
BEGIN
  -- Find the documentation space for this project
  SELECT id INTO project_space_id
  FROM public.doc_spaces
  WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
  LIMIT 1;
  
  IF project_space_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Handle INSERT or UPDATE
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.space_permissions (space_id, user_id, role, granted_by)
    VALUES (
      project_space_id,
      NEW.user_id,
      CASE 
        WHEN NEW.role = 'manager' THEN 'admin'::space_role
        ELSE 'editor'::space_role
      END,
      auth.uid()
    )
    ON CONFLICT (space_id, user_id) 
    DO UPDATE SET 
      role = CASE 
        WHEN NEW.role = 'manager' THEN 'admin'::space_role
        ELSE 'editor'::space_role
      END;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.space_permissions
    WHERE space_id = project_space_id
    AND user_id = OLD.user_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_project_member_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.project_members
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_project_member_to_space();
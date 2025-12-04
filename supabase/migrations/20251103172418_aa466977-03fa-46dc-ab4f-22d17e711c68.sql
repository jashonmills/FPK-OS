-- Backfill documentation spaces for existing projects that don't have one
DO $$
DECLARE
  project_record RECORD;
  new_space_id UUID;
BEGIN
  FOR project_record IN 
    SELECT id, name
    FROM public.projects
    WHERE NOT EXISTS (
      SELECT 1 FROM public.doc_spaces ds
      WHERE ds.project_id = id
    )
  LOOP
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
      project_record.name || ' Docs',
      'Documentation for ' || project_record.name || ' project',
      '📦',
      (SELECT user_id FROM public.project_members WHERE project_id = project_record.id LIMIT 1),
      project_record.id,
      false,
      false
    )
    RETURNING id INTO new_space_id;
    
    -- Grant permissions to all project members
    INSERT INTO public.space_permissions (space_id, user_id, role, granted_by)
    SELECT 
      new_space_id,
      pm.user_id,
      CASE 
        WHEN pm.role = 'manager' THEN 'admin'::space_role
        ELSE 'editor'::space_role
      END,
      pm.user_id
    FROM public.project_members pm
    WHERE pm.project_id = project_record.id
    ON CONFLICT (space_id, user_id) DO NOTHING;
  END LOOP;
END $$;
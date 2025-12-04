-- Backfill missing space_permissions for space creators
-- This fixes spaces created before the trigger was in place

INSERT INTO public.space_permissions (space_id, user_id, role, granted_by)
SELECT 
  ds.id as space_id,
  ds.created_by as user_id,
  'admin'::space_role as role,
  ds.created_by as granted_by
FROM public.doc_spaces ds
WHERE ds.is_personal = false
  AND NOT EXISTS (
    SELECT 1 
    FROM public.space_permissions sp 
    WHERE sp.space_id = ds.id 
    AND sp.user_id = ds.created_by
  )
ON CONFLICT (space_id, user_id) DO NOTHING;
-- Backfill personal spaces for existing users who don't have one
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN 
    SELECT p.id, p.full_name
    FROM public.profiles p
    WHERE NOT EXISTS (
      SELECT 1 FROM public.doc_spaces ds
      WHERE ds.created_by = p.id
      AND ds.is_personal = true
    )
  LOOP
    INSERT INTO public.doc_spaces (
      name,
      description,
      icon,
      created_by,
      is_personal,
      is_public
    ) VALUES (
      COALESCE(profile_record.full_name || '''s', 'My') || ' Notebook',
      'Your personal documentation space',
      '🔒',
      profile_record.id,
      true,
      false
    );
  END LOOP;
END $$;
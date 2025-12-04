-- Check if there are any existing triggers that might cause the updated_at error
DO $$
BEGIN
    -- Drop any triggers that might be trying to set updated_at on org_members
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_updated_at_column_before' AND tgrelid = 'public.org_members'::regclass) THEN
        DROP TRIGGER update_updated_at_column_before ON public.org_members;
        RAISE NOTICE 'Dropped trigger update_updated_at_column_before from org_members';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at' AND tgrelid = 'public.org_members'::regclass) THEN
        DROP TRIGGER set_updated_at ON public.org_members;
        RAISE NOTICE 'Dropped trigger set_updated_at from org_members';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_org_members_updated_at' AND tgrelid = 'public.org_members'::regclass) THEN
        DROP TRIGGER update_org_members_updated_at ON public.org_members;
        RAISE NOTICE 'Dropped trigger update_org_members_updated_at from org_members';
    END IF;
END
$$;
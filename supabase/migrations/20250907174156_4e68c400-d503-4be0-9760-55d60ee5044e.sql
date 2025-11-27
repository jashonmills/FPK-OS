-- Fix foreign key relationship for org_members to profiles
-- The issue is that the query is trying to join org_members.user_id with profiles, but the relationship isn't properly defined

-- Check if foreign key exists
DO $$
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'org_members_user_id_fkey' 
        AND table_name = 'org_members'
    ) THEN
        ALTER TABLE public.org_members 
        ADD CONSTRAINT org_members_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Also ensure profiles table has proper foreign key
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fkey' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;
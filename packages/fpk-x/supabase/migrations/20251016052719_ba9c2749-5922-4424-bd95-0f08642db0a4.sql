-- First, ensure we have the super_admin role in the app_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'super_admin');
    ELSIF NOT EXISTS (SELECT 1 FROM unnest(enum_range(NULL::public.app_role)) WHERE unnest = 'super_admin') THEN
        ALTER TYPE public.app_role ADD VALUE 'super_admin';
    END IF;
END $$;

-- Get the user ID for jashon@fpkuniversity.com
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Find the user by email
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'jashon@fpkuniversity.com'
    LIMIT 1;
    
    -- If user exists, grant them super_admin role
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'super_admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Super admin role granted to jashon@fpkuniversity.com';
    ELSE
        RAISE NOTICE 'User jashon@fpkuniversity.com not found';
    END IF;
END $$;
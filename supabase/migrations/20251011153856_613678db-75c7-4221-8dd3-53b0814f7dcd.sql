-- Add admin, instructor_aide, and viewer roles to member_role enum
-- These must be added in separate transactions from their usage

DO $$ 
BEGIN
  -- Add instructor_aide if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'instructor_aide' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'member_role')
  ) THEN
    ALTER TYPE public.member_role ADD VALUE 'instructor_aide';
  END IF;
END $$;

DO $$ 
BEGIN
  -- Add viewer if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'viewer' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'member_role')
  ) THEN
    ALTER TYPE public.member_role ADD VALUE 'viewer';
  END IF;
END $$;

DO $$ 
BEGIN
  -- Add admin if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'admin' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'member_role')
  ) THEN
    ALTER TYPE public.member_role ADD VALUE 'admin';
  END IF;
END $$;
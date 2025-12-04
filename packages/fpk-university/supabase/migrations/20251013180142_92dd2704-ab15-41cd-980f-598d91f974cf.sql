-- Phase 2: AI Coach Portal - Add ai_coach_user role
-- Note: Enum value addition must be in its own transaction

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ai_coach_user' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE 'ai_coach_user';
  END IF;
END $$;
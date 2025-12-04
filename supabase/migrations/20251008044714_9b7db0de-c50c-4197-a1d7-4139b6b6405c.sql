-- Phase 1.1: Add pin_hash column to org_members table for step-up authentication
-- This allows platform users (who exist in auth.users) to have organizational PINs

ALTER TABLE public.org_members 
ADD COLUMN IF NOT EXISTS pin_hash TEXT;

COMMENT ON COLUMN public.org_members.pin_hash IS 
'Hashed PIN (bcrypt) for step-up authentication into this organization. Used by students, instructors, and educators. Owners bypass PIN requirement.';
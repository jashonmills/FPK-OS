-- Add new custom profile fields to personas table
ALTER TABLE public.personas
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS pronouns TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS diagnosis_info TEXT,
ADD COLUMN IF NOT EXISTS why_i_am_here TEXT;

-- Add comments to document the purpose of each field
COMMENT ON COLUMN public.personas.headline IS 'A short one-line summary displayed under the user name';
COMMENT ON COLUMN public.personas.pronouns IS 'User preferred pronouns (e.g., she/her, he/him, they/them)';
COMMENT ON COLUMN public.personas.location IS 'User location (city, state, or general area)';
COMMENT ON COLUMN public.personas.interests IS 'Array of user interests/tags stored as JSONB';
COMMENT ON COLUMN public.personas.diagnosis_info IS 'Optional field for users to share diagnosis information they are comfortable with';
COMMENT ON COLUMN public.personas.why_i_am_here IS 'User personal mission statement or reason for joining the community';
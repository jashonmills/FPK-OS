-- Add display_name column to org_api_keys for custom provider names
ALTER TABLE public.org_api_keys
ADD COLUMN IF NOT EXISTS display_name TEXT;
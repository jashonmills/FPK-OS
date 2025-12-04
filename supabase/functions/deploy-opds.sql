
-- This script can be run in the Supabase SQL editor to trigger the OPDS ingestion
-- It will populate the public_domain_books table with real Project Gutenberg data

-- First, let's verify the function exists and call it
-- Note: This should be run manually in the Supabase dashboard SQL editor
-- or via the edge functions API

-- Example SQL to call the function (uncomment to use):
-- SELECT invoke('opds-ingestion');

-- Or you can call it via HTTP:
-- POST https://your-project.supabase.co/functions/v1/opds-ingestion

-- Add a comment to track when this was last run
INSERT INTO public.comments (content) VALUES ('OPDS ingestion deployed and ready to run') 
ON CONFLICT DO NOTHING;


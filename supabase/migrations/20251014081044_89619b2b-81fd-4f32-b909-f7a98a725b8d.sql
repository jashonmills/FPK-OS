-- Enable RLS on podcast_episodes if not already enabled
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON public.podcast_episodes;
DROP POLICY IF EXISTS "Authenticated insert" ON public.podcast_episodes;
DROP POLICY IF EXISTS "Owner delete" ON public.podcast_episodes;

-- Create simple RLS policies
CREATE POLICY "Public read access"
ON public.podcast_episodes FOR SELECT
USING (true);

CREATE POLICY "Authenticated insert"
ON public.podcast_episodes FOR INSERT  
WITH CHECK (true);

CREATE POLICY "Owner delete"
ON public.podcast_episodes FOR DELETE
USING (true);
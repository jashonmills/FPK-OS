
-- Create search_analytics table to track user search patterns
CREATE TABLE public.search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  query text NOT NULL,
  category text,
  result_count integer DEFAULT 0,
  source_type text CHECK (source_type IN ('library', 'books', 'courses')) DEFAULT 'library',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on search_analytics
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for search_analytics
CREATE POLICY "Users can view their own search analytics" 
  ON public.search_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search analytics" 
  ON public.search_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

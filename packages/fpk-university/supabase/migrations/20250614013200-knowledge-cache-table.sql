
-- Create knowledge_cache table for external knowledge retrieval
CREATE TABLE IF NOT EXISTS knowledge_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  content TEXT NOT NULL,
  last_fetched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  query_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_knowledge_cache_topic ON knowledge_cache(topic);
CREATE INDEX IF NOT EXISTS idx_knowledge_cache_query_hash ON knowledge_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_knowledge_cache_last_fetched ON knowledge_cache(last_fetched);

-- Add RLS policies
ALTER TABLE knowledge_cache ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to knowledge cache" ON knowledge_cache
  FOR SELECT TO authenticated
  USING (true);

-- Allow insert/update for service role (edge functions)
CREATE POLICY "Allow service role to manage knowledge cache" ON knowledge_cache
  FOR ALL TO service_role
  USING (true);

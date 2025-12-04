-- Add fields to blog_authors table
ALTER TABLE public.blog_authors
ADD COLUMN IF NOT EXISTS is_ai_author BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS credentials TEXT,
ADD COLUMN IF NOT EXISTS author_slug TEXT;

-- Create unique index on author_slug
CREATE UNIQUE INDEX IF NOT EXISTS blog_authors_author_slug_key ON public.blog_authors(author_slug);
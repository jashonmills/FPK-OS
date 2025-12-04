
-- Create storage bucket for books
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('books', 'books', true, 52428800, ARRAY['application/epub+zip']::text[]);

-- Create storage policies for the books bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'books');
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'books');
CREATE POLICY "Allow public updates" ON storage.objects FOR UPDATE USING (bucket_id = 'books');
CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE USING (bucket_id = 'books');

-- Add new columns to public_domain_books table for local storage
ALTER TABLE public_domain_books 
ADD COLUMN IF NOT EXISTS storage_url TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS download_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS last_download_attempt TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS download_error_message TEXT;

-- Create index for download status queries
CREATE INDEX IF NOT EXISTS idx_public_domain_books_download_status ON public_domain_books(download_status);

-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

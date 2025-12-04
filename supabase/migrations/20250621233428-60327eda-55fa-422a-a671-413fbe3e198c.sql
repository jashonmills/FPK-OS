
-- Create storage bucket for knowledge base files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kb_files',
  'kb_files',
  false,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/rtf',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp'
  ]
);

-- Create RLS policies for the kb_files bucket
CREATE POLICY "Users can upload their own KB files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kb_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own KB files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'kb_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own KB files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kb_files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create knowledge_base_files table
CREATE TABLE public.knowledge_base_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to knowledge_base_files
ALTER TABLE public.knowledge_base_files ENABLE ROW LEVEL SECURITY;

-- RLS policies for knowledge_base_files
CREATE POLICY "Users can view their own KB files"
ON public.knowledge_base_files FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KB files"
ON public.knowledge_base_files FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KB files"
ON public.knowledge_base_files FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own KB files"
ON public.knowledge_base_files FOR DELETE
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_knowledge_base_files_user_id ON public.knowledge_base_files(user_id);
CREATE INDEX idx_knowledge_base_files_uploaded_at ON public.knowledge_base_files(uploaded_at DESC);
CREATE INDEX idx_knowledge_base_files_processed ON public.knowledge_base_files(processed);

-- Add trigger for updating updated_at column
CREATE TRIGGER update_knowledge_base_files_updated_at
  BEFORE UPDATE ON public.knowledge_base_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

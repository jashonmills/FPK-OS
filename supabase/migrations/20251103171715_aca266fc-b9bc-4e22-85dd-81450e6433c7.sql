-- Create file_document_links table for linking files to documentation pages
CREATE TABLE IF NOT EXISTS public.file_document_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID NOT NULL REFERENCES public.project_files(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES public.doc_pages(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(file_id, page_id)
);

-- Enable RLS
ALTER TABLE public.file_document_links ENABLE ROW LEVEL SECURITY;

-- Users can create links for files they have access to
CREATE POLICY "Users can create file document links"
  ON public.file_document_links
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
  );

-- Users can view links for files they can access
CREATE POLICY "Users can view file document links"
  ON public.file_document_links
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.project_files
      WHERE project_files.id = file_document_links.file_id
    )
  );

-- Users can delete links they created
CREATE POLICY "Users can delete their own file document links"
  ON public.file_document_links
  FOR DELETE
  USING (auth.uid() = created_by);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_file_document_links_file_id ON public.file_document_links(file_id);
CREATE INDEX IF NOT EXISTS idx_file_document_links_page_id ON public.file_document_links(page_id);
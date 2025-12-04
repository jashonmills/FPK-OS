
-- Create user_uploaded_books table for PDF upload workflow
CREATE TABLE public.user_uploaded_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for user_uploaded_books
ALTER TABLE public.user_uploaded_books ENABLE ROW LEVEL SECURITY;

-- Allow users to INSERT their own uploads
CREATE POLICY "Users can insert their own uploads" 
  ON public.user_uploaded_books 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to SELECT their own uploads
CREATE POLICY "Users can view their own uploads" 
  ON public.user_uploaded_books 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow admins to SELECT and UPDATE any upload
CREATE POLICY "Admins can view all uploads" 
  ON public.user_uploaded_books 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any upload" 
  ON public.user_uploaded_books 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow all users to view approved uploads (for global library)
CREATE POLICY "All users can view approved uploads" 
  ON public.user_uploaded_books 
  FOR SELECT 
  USING (status = 'approved');

-- Add trigger to update updated_at
CREATE TRIGGER update_user_uploaded_books_updated_at
  BEFORE UPDATE ON public.user_uploaded_books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage policies for library-book-pdf bucket
-- Allow authenticated users to upload to their own directory
INSERT INTO storage.buckets (id, name, public) 
VALUES ('library-book-pdf', 'library-book-pdf', true)
ON CONFLICT (id) DO NOTHING;

-- Allow users to upload files to their own user directory
CREATE POLICY "Users can upload to their own directory"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'library-book-pdf' AND 
  (storage.foldername(name))[1] = 'user-uploads' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Allow users to read files from the library-book-pdf bucket
CREATE POLICY "Allow public read access to library PDFs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'library-book-pdf');

-- Allow users to delete their own uploads (optional)
CREATE POLICY "Users can delete their own uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'library-book-pdf' AND 
  (storage.foldername(name))[1] = 'user-uploads' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

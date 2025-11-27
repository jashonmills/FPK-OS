
-- Add openlibrary_key and is_user_added fields to public_domain_books table
ALTER TABLE public_domain_books 
ADD COLUMN IF NOT EXISTS openlibrary_key text,
ADD COLUMN IF NOT EXISTS is_user_added boolean DEFAULT false;

-- Create index for better performance on openlibrary_key lookups
CREATE INDEX IF NOT EXISTS idx_public_domain_books_openlibrary_key ON public_domain_books(openlibrary_key);

-- Create index for filtering user-added vs curated books
CREATE INDEX IF NOT EXISTS idx_public_domain_books_is_user_added ON public_domain_books(is_user_added);

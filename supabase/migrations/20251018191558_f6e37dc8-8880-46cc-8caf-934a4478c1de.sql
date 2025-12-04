-- Make user_id nullable to support AI authors without user accounts
ALTER TABLE public.blog_authors 
ALTER COLUMN user_id DROP NOT NULL;

-- Drop the existing unique constraint
ALTER TABLE public.blog_authors 
DROP CONSTRAINT IF EXISTS blog_authors_user_id_key;

-- Add a partial unique index: only enforce uniqueness for non-NULL user_ids
-- This allows multiple AI authors (user_id = NULL) but only one author per real user
CREATE UNIQUE INDEX blog_authors_user_id_unique_idx 
ON public.blog_authors(user_id) 
WHERE user_id IS NOT NULL;

-- Update RLS policies to allow admins to manage AI authors
DROP POLICY IF EXISTS "Users can manage their author profile" ON public.blog_authors;

CREATE POLICY "Users can manage their author profile"
ON public.blog_authors
FOR ALL
USING (
  (user_id = auth.uid()) OR 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  (user_id = auth.uid()) OR 
  (has_role(auth.uid(), 'admin'::app_role) AND (user_id IS NULL OR user_id = auth.uid()))
);
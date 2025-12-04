-- Fix blog_posts.author_id foreign key constraint
-- It should reference blog_authors.id, not the users table

-- Step 1: Drop the old foreign key constraint first
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;

-- Step 2: Now update any existing posts that have user_id as author_id
-- to use the correct blog_authors.id
UPDATE blog_posts bp
SET author_id = ba.id
FROM blog_authors ba
WHERE bp.author_id::text = ba.user_id::text;

-- Step 3: Add the correct foreign key constraint
ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES blog_authors(id) 
ON DELETE SET NULL;
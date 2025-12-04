-- Step 1: Drop the incorrect foreign key constraint FIRST
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;

-- Step 2: Update all existing posts to use persona IDs instead of user IDs
UPDATE posts
SET author_id = personas.id
FROM personas
WHERE posts.author_id = personas.user_id;

-- Step 3: Add the correct foreign key constraint pointing to personas table
ALTER TABLE posts 
ADD CONSTRAINT posts_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES personas(id) 
ON DELETE CASCADE;
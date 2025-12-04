-- Fix post_comments.author_id to reference personas.id instead of user_id

-- Step 1: Drop existing RLS policies that depend on author_id
DROP POLICY IF EXISTS "Users can create comments on posts they can see" ON post_comments;
DROP POLICY IF EXISTS "Authors can update own comments" ON post_comments;
DROP POLICY IF EXISTS "Authors or post authors can delete comments" ON post_comments;

-- Step 2: Add new column for persona_id
ALTER TABLE post_comments ADD COLUMN author_persona_id uuid;

-- Step 3: Migrate existing data - map user_id to persona_id
UPDATE post_comments pc
SET author_persona_id = p.id
FROM personas p
WHERE pc.author_id = p.user_id;

-- Step 4: Make it NOT NULL after data migration
ALTER TABLE post_comments ALTER COLUMN author_persona_id SET NOT NULL;

-- Step 5: Drop the old author_id column
ALTER TABLE post_comments DROP COLUMN author_id;

-- Step 6: Rename new column to author_id
ALTER TABLE post_comments RENAME COLUMN author_persona_id TO author_id;

-- Step 7: Add foreign key constraint
ALTER TABLE post_comments 
ADD CONSTRAINT post_comments_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES personas(id) ON DELETE CASCADE;

-- Step 8: Recreate RLS policies with correct logic (author_id is now persona_id)
CREATE POLICY "Users can create comments on posts they can see" 
ON post_comments 
FOR INSERT 
WITH CHECK (
  user_owns_persona(auth.uid(), author_id)
  AND EXISTS (
    SELECT 1 FROM posts
    JOIN circle_members ON circle_members.circle_id = posts.circle_id
    WHERE posts.id = post_comments.post_id 
    AND circle_members.user_id = auth.uid()
  )
);

CREATE POLICY "Authors can update own comments" 
ON post_comments 
FOR UPDATE 
USING (user_owns_persona(auth.uid(), author_id));

CREATE POLICY "Authors or post authors can delete comments" 
ON post_comments 
FOR DELETE 
USING (
  user_owns_persona(auth.uid(), author_id) 
  OR EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_comments.post_id 
    AND user_owns_persona(auth.uid(), posts.author_id)
  )
);
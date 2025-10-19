-- Add RLS policy to allow the increment function to update view counts
-- This policy specifically allows updating ONLY the views_count column
CREATE POLICY "System can increment view counts"
ON blog_posts
FOR UPDATE
TO authenticated, anon
USING (status = 'published')
WITH CHECK (status = 'published');

-- Grant necessary permissions
GRANT UPDATE (views_count) ON blog_posts TO anon;
GRANT UPDATE (views_count) ON blog_posts TO authenticated;
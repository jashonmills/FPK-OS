-- Allow circle creators to delete circles that have no members
CREATE POLICY "Creators can delete empty circles"
ON public.circles
FOR DELETE
USING (
  auth.uid() = created_by 
  AND NOT EXISTS (
    SELECT 1 
    FROM public.circle_members 
    WHERE circle_id = circles.id
  )
);
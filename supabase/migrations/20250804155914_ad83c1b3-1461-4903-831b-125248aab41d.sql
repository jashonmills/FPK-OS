-- Update the RLS policy for contact_submissions to ensure admins can view beta feedback
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view all submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);

-- Also ensure admins can update submission status
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;

CREATE POLICY "Admins can update submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));
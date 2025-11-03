-- Create enum type for time entry status
CREATE TYPE time_entry_status AS ENUM ('open', 'submitted', 'approved', 'rejected', 'paid');

-- Add status column with default 'open'
ALTER TABLE public.time_entries 
ADD COLUMN status time_entry_status NOT NULL DEFAULT 'open';

-- Create indexes for efficient status filtering
CREATE INDEX idx_time_entries_status ON public.time_entries(status);
CREATE INDEX idx_time_entries_user_date_status ON public.time_entries(user_id, entry_date, status);

-- Drop existing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own time entries" ON public.time_entries;

-- Create new policy that restricts editing to 'open' and 'rejected' statuses
CREATE POLICY "Users can update their own editable time entries" 
ON public.time_entries
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = user_id 
  AND status IN ('open', 'rejected')
)
WITH CHECK (
  auth.uid() = user_id 
  AND status IN ('open', 'rejected')
);

-- Drop existing DELETE policy
DROP POLICY IF EXISTS "Users can delete their own time entries" ON public.time_entries;

-- Create new policy that restricts deletion to 'open' and 'rejected' statuses
CREATE POLICY "Users can delete their own editable time entries" 
ON public.time_entries
FOR DELETE 
TO authenticated
USING (
  auth.uid() = user_id 
  AND status IN ('open', 'rejected')
);

-- Add timesheet submission and approval permissions
INSERT INTO public.permissions (name, category, description)
VALUES 
  ('timesheet_submit', 'time', 'Submit own timesheet for approval'),
  ('timesheet_approve', 'time', 'Approve or reject employee timesheets');

-- Grant submit permission to all non-admin roles
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'member'::app_role, id FROM public.permissions WHERE name = 'timesheet_submit'
UNION ALL
SELECT 'viewer'::app_role, id FROM public.permissions WHERE name = 'timesheet_submit'
UNION ALL
SELECT 'it'::app_role, id FROM public.permissions WHERE name = 'timesheet_submit';

-- Grant approval permission to HR and Admin
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'hr'::app_role, id FROM public.permissions WHERE name = 'timesheet_approve'
UNION ALL
SELECT 'admin'::app_role, id FROM public.permissions WHERE name = 'timesheet_approve';
-- Add RLS policies for users to view their own payroll data

-- Allow users to view their own payroll line items, admins can view all
CREATE POLICY "Users can view their own payroll line items"
ON payroll_run_line_items
FOR SELECT
TO authenticated
USING (
  auth.uid() = employee_user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow users to view payroll runs that contain their data, admins can view all
CREATE POLICY "Users can view relevant payroll runs"
ON payroll_runs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM payroll_run_line_items
    WHERE payroll_run_line_items.payroll_run_id = payroll_runs.id
    AND payroll_run_line_items.employee_user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);
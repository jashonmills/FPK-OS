-- Create payroll_runs table
CREATE TABLE public.payroll_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pay_period_start_date DATE NOT NULL,
  pay_period_end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_hours NUMERIC(10,2) NOT NULL,
  total_cost NUMERIC(12,2) NOT NULL,
  processed_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  CONSTRAINT valid_pay_period CHECK (pay_period_end_date >= pay_period_start_date)
);

-- Create payroll_run_line_items table
CREATE TABLE public.payroll_run_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id UUID NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
  employee_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_hours NUMERIC(10,2) NOT NULL,
  hourly_rate NUMERIC(10,2) NOT NULL,
  total_pay NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(payroll_run_id, employee_user_id)
);

-- Create indexes for performance
CREATE INDEX idx_payroll_runs_dates ON public.payroll_runs(pay_period_start_date, pay_period_end_date);
CREATE INDEX idx_payroll_runs_status ON public.payroll_runs(status);
CREATE INDEX idx_payroll_line_items_run ON public.payroll_run_line_items(payroll_run_id);
CREATE INDEX idx_payroll_line_items_employee ON public.payroll_run_line_items(employee_user_id);

-- Enable RLS
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_run_line_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payroll_runs
CREATE POLICY "Admins can view all payroll runs"
  ON public.payroll_runs FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create payroll runs"
  ON public.payroll_runs FOR INSERT
  TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payroll runs"
  ON public.payroll_runs FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete payroll runs"
  ON public.payroll_runs FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for payroll_run_line_items
CREATE POLICY "Admins can view all line items"
  ON public.payroll_run_line_items FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create line items"
  ON public.payroll_run_line_items FOR INSERT
  TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update line items"
  ON public.payroll_run_line_items FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete line items"
  ON public.payroll_run_line_items FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create view for payroll reports
CREATE OR REPLACE VIEW public.vw_payroll_report AS
SELECT 
  te.id as time_entry_id,
  te.user_id,
  p.full_name as user_name,
  p.email as user_email,
  te.project_id,
  proj.name as project_name,
  te.task_id,
  t.title as task_title,
  te.entry_date,
  te.hours_logged,
  te.description,
  te.created_at,
  COALESCE(
    (SELECT ur.hourly_rate 
     FROM public.user_rates ur 
     WHERE ur.user_id = te.user_id 
     AND ur.effective_date <= te.entry_date 
     ORDER BY ur.effective_date DESC 
     LIMIT 1),
    0
  ) as hourly_rate,
  te.hours_logged * COALESCE(
    (SELECT ur.hourly_rate 
     FROM public.user_rates ur 
     WHERE ur.user_id = te.user_id 
     AND ur.effective_date <= te.entry_date 
     ORDER BY ur.effective_date DESC 
     LIMIT 1),
    0
  ) as calculated_cost
FROM public.time_entries te
JOIN public.profiles p ON p.id = te.user_id
JOIN public.projects proj ON proj.id = te.project_id
LEFT JOIN public.tasks t ON t.id = te.task_id
ORDER BY te.entry_date DESC, te.created_at DESC;
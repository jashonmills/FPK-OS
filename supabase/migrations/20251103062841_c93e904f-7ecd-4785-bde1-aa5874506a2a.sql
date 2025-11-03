-- ============================================================================
-- FPK PULSE BUDGET SYSTEM - DATABASE SCHEMA
-- ============================================================================

-- 1. TIME TRACKING TABLES (Foundation for automatic labor costs)
-- ============================================================================

-- Time entries table
CREATE TABLE public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  hours_logged NUMERIC(5,2) NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT positive_hours CHECK (hours_logged > 0)
);

-- User hourly rates table (admin-managed)
CREATE TABLE public.user_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hourly_rate NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, effective_date),
  CONSTRAINT positive_rate CHECK (hourly_rate >= 0)
);

-- 2. BUDGET SYSTEM TABLES
-- ============================================================================

-- Project budgets (one per project)
CREATE TABLE public.project_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  total_budget NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  CONSTRAINT positive_budget CHECK (total_budget > 0)
);

-- Budget categories (e.g., Labor, Software, Marketing)
CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.project_budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  allocated_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(budget_id, name),
  CONSTRAINT positive_allocation CHECK (allocated_amount >= 0)
);

-- Project expenses (manual + auto-generated from time)
CREATE TABLE public.project_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.budget_categories(id) ON DELETE RESTRICT,
  amount NUMERIC(12,2) NOT NULL,
  description TEXT NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  receipt_url TEXT,
  is_auto_generated BOOLEAN NOT NULL DEFAULT false,
  time_entry_id UUID REFERENCES public.time_entries(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Time entries RLS
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all time entries"
  ON public.time_entries FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can create their own time entries"
  ON public.time_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time entries"
  ON public.time_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time entries"
  ON public.time_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- User rates RLS (admin-only)
ALTER TABLE public.user_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all rates"
  ON public.user_rates FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert rates"
  ON public.user_rates FOR INSERT
  TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update rates"
  ON public.user_rates FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rates"
  ON public.user_rates FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Project budgets RLS
ALTER TABLE public.project_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view budgets"
  ON public.project_budgets FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create budgets"
  ON public.project_budgets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update budgets"
  ON public.project_budgets FOR UPDATE
  TO authenticated USING (true);

-- Budget categories RLS
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view categories"
  ON public.budget_categories FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON public.budget_categories FOR ALL
  TO authenticated USING (true);

-- Project expenses RLS
ALTER TABLE public.project_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view expenses"
  ON public.project_expenses FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can create expenses"
  ON public.project_expenses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = logged_by_user_id);

CREATE POLICY "Users can update their own expenses"
  ON public.project_expenses FOR UPDATE
  TO authenticated USING (auth.uid() = logged_by_user_id);

CREATE POLICY "Users can delete their own expenses"
  ON public.project_expenses FOR DELETE
  TO authenticated USING (auth.uid() = logged_by_user_id);

-- 4. DATABASE FUNCTIONS
-- ============================================================================

-- Get user's current hourly rate
CREATE OR REPLACE FUNCTION public.get_user_hourly_rate(p_user_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS NUMERIC AS $$
DECLARE
  rate NUMERIC;
BEGIN
  SELECT hourly_rate INTO rate
  FROM public.user_rates
  WHERE user_id = p_user_id
  AND effective_date <= p_date
  ORDER BY effective_date DESC
  LIMIT 1;
  
  RETURN COALESCE(rate, 0);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 5. TRIGGERS
-- ============================================================================

-- Validate category allocations don't exceed budget
CREATE OR REPLACE FUNCTION public.validate_category_allocation()
RETURNS TRIGGER AS $$
DECLARE
  total_allocated NUMERIC;
  budget_amount NUMERIC;
BEGIN
  SELECT total_budget INTO budget_amount
  FROM public.project_budgets
  WHERE id = NEW.budget_id;

  SELECT COALESCE(SUM(allocated_amount), 0) INTO total_allocated
  FROM public.budget_categories
  WHERE budget_id = NEW.budget_id
  AND (TG_OP = 'INSERT' OR id != NEW.id);

  IF (total_allocated + NEW.allocated_amount) > budget_amount THEN
    RAISE EXCEPTION 'Category allocations (% + %) exceed total budget (%)', 
      total_allocated, NEW.allocated_amount, budget_amount;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_category_allocation
BEFORE INSERT OR UPDATE ON public.budget_categories
FOR EACH ROW EXECUTE FUNCTION public.validate_category_allocation();

-- Auto-generate labor expense when time is logged
CREATE OR REPLACE FUNCTION public.auto_create_labor_expense()
RETURNS TRIGGER AS $$
DECLARE
  user_rate NUMERIC;
  labor_cost NUMERIC;
  labor_category_id UUID;
  user_name TEXT;
  task_title TEXT;
BEGIN
  -- Get user's hourly rate
  user_rate := public.get_user_hourly_rate(NEW.user_id, NEW.entry_date);
  
  -- If no rate is set, skip expense creation
  IF user_rate = 0 THEN
    RETURN NEW;
  END IF;
  
  -- Calculate labor cost
  labor_cost := NEW.hours_logged * user_rate;
  
  -- Find "Labor Costs" category for this project
  SELECT bc.id INTO labor_category_id
  FROM public.budget_categories bc
  JOIN public.project_budgets pb ON pb.id = bc.budget_id
  WHERE pb.project_id = NEW.project_id
  AND LOWER(bc.name) = 'labor costs'
  LIMIT 1;
  
  -- If no budget or labor category exists, skip
  IF labor_category_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get user name and task title for description
  SELECT full_name INTO user_name
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  SELECT title INTO task_title
  FROM public.tasks
  WHERE id = NEW.task_id;
  
  -- Create expense record
  INSERT INTO public.project_expenses (
    project_id,
    category_id,
    amount,
    description,
    expense_date,
    logged_by_user_id,
    is_auto_generated,
    time_entry_id
  ) VALUES (
    NEW.project_id,
    labor_category_id,
    labor_cost,
    format('Labor: %s - %s (%s hrs @ $%s/hr)', 
           COALESCE(user_name, 'Unknown'), 
           COALESCE(task_title, 'Unknown Task'),
           NEW.hours_logged,
           user_rate),
    NEW.entry_date,
    NEW.user_id,
    true,
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER auto_labor_expense_trigger
AFTER INSERT ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.auto_create_labor_expense();

-- Update labor expense when time entry changes
CREATE OR REPLACE FUNCTION public.update_labor_expense()
RETURNS TRIGGER AS $$
DECLARE
  user_rate NUMERIC;
  new_labor_cost NUMERIC;
  user_name TEXT;
  task_title TEXT;
BEGIN
  user_rate := public.get_user_hourly_rate(NEW.user_id, NEW.entry_date);
  
  IF user_rate = 0 THEN
    RETURN NEW;
  END IF;
  
  new_labor_cost := NEW.hours_logged * user_rate;
  
  SELECT full_name INTO user_name FROM public.profiles WHERE id = NEW.user_id;
  SELECT title INTO task_title FROM public.tasks WHERE id = NEW.task_id;
  
  UPDATE public.project_expenses
  SET amount = new_labor_cost,
      description = format('Labor: %s - %s (%s hrs @ $%s/hr)', 
                          COALESCE(user_name, 'Unknown'), 
                          COALESCE(task_title, 'Unknown Task'),
                          NEW.hours_logged,
                          user_rate),
      expense_date = NEW.entry_date
  WHERE time_entry_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_labor_expense_trigger
AFTER UPDATE ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.update_labor_expense();

-- Delete labor expense when time entry is deleted
CREATE OR REPLACE FUNCTION public.delete_labor_expense()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.project_expenses WHERE time_entry_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER delete_labor_expense_trigger
AFTER DELETE ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.delete_labor_expense();

-- Update updated_at timestamp
CREATE TRIGGER update_time_entries_updated_at
BEFORE UPDATE ON public.time_entries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_budgets_updated_at
BEFORE UPDATE ON public.project_budgets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. STORAGE BUCKET FOR RECEIPTS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-receipts', 'project-receipts', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for receipts
CREATE POLICY "Authenticated users can view receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'project-receipts');

CREATE POLICY "Authenticated users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
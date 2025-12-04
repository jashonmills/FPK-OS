-- Add start_date column to tasks table for Timeline/Gantt view support
ALTER TABLE public.tasks ADD COLUMN start_date TIMESTAMP WITH TIME ZONE;

-- Add index for better query performance on date ranges
CREATE INDEX idx_tasks_start_date ON public.tasks(start_date);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
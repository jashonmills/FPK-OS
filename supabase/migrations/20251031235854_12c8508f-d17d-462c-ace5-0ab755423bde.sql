-- Fix trigger that references non-existent behavior_description column
-- Drop and recreate the trigger for parent_logs updated_at

-- First, drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_parent_logs_updated_at ON public.parent_logs;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS public.update_parent_logs_updated_at() CASCADE;

-- Create a clean trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for parent_logs
CREATE TRIGGER update_parent_logs_updated_at
BEFORE UPDATE ON public.parent_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
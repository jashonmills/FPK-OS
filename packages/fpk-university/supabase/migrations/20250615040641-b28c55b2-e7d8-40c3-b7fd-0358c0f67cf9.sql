
-- Create threshold_configs table
CREATE TABLE public.threshold_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  upper_threshold NUMERIC NOT NULL,
  lower_threshold NUMERIC NOT NULL,
  time_window TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'disabled')),
  risk_level TEXT NOT NULL DEFAULT 'warning' CHECK (risk_level IN ('info', 'warning', 'critical')),
  user_segment TEXT NULL,
  description TEXT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_segments table
CREATE TABLE public.user_segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria JSONB NOT NULL DEFAULT '{}',
  user_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create threshold_audit_log table
CREATE TABLE public.threshold_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  threshold_id UUID NOT NULL REFERENCES public.threshold_configs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  changes JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_threshold_configs_metric ON public.threshold_configs (metric_name);
CREATE INDEX idx_threshold_configs_status ON public.threshold_configs (status);
CREATE INDEX idx_threshold_configs_created_by ON public.threshold_configs (created_by);
CREATE INDEX idx_user_segments_name ON public.user_segments (name);
CREATE INDEX idx_threshold_audit_log_threshold_id ON public.threshold_audit_log (threshold_id);
CREATE INDEX idx_threshold_audit_log_user_id ON public.threshold_audit_log (user_id);
CREATE INDEX idx_threshold_audit_log_timestamp ON public.threshold_audit_log (timestamp);

-- Enable Row Level Security
ALTER TABLE public.threshold_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threshold_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for threshold_configs
CREATE POLICY "Users can view all threshold configs" 
  ON public.threshold_configs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert threshold configs" 
  ON public.threshold_configs 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update threshold configs" 
  ON public.threshold_configs 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete threshold configs" 
  ON public.threshold_configs 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Create RLS policies for user_segments
CREATE POLICY "Users can view all user segments" 
  ON public.user_segments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert user segments" 
  ON public.user_segments 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update user segments" 
  ON public.user_segments 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete user segments" 
  ON public.user_segments 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for threshold_audit_log
CREATE POLICY "Users can view all audit log entries" 
  ON public.threshold_audit_log 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can insert audit log entries" 
  ON public.threshold_audit_log 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically log threshold changes
CREATE OR REPLACE FUNCTION public.log_threshold_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('create', NEW.id, NEW.created_by, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('update', NEW.id, NEW.created_by, jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.threshold_audit_log (action, threshold_id, user_id, changes)
    VALUES ('delete', OLD.id, OLD.created_by, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic audit logging
CREATE TRIGGER threshold_config_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.threshold_configs
  FOR EACH ROW EXECUTE FUNCTION public.log_threshold_changes();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_threshold_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER threshold_config_updated_at_trigger
  BEFORE UPDATE ON public.threshold_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_threshold_updated_at();

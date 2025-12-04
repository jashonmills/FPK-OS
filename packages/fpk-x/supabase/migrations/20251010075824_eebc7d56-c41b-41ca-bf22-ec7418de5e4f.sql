-- Create external integrations table for storing OAuth connections
CREATE TABLE public.external_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('garmin', 'fitbit', 'apple_health')),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(family_id, provider)
);

-- Create wearable sleep data table
CREATE TABLE public.wearable_sleep_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  sleep_date DATE NOT NULL,
  sleep_score INTEGER CHECK (sleep_score >= 0 AND sleep_score <= 100),
  deep_sleep_seconds INTEGER,
  light_sleep_seconds INTEGER,
  rem_sleep_seconds INTEGER,
  awake_seconds INTEGER,
  avg_heart_rate INTEGER,
  avg_respiration_rate NUMERIC,
  avg_spo2 NUMERIC,
  restlessness_score INTEGER,
  sleep_start_time TIMESTAMP WITH TIME ZONE,
  sleep_end_time TIMESTAMP WITH TIME ZONE,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(family_id, student_id, sleep_date)
);

-- Create biometric alerts table
CREATE TABLE public.biometric_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('heart_rate_elevated', 'stress_level_high', 'low_battery')),
  trigger_value NUMERIC,
  baseline_value NUMERIC,
  alert_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create alert configuration table
CREATE TABLE public.alert_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  heart_rate_threshold_percent INTEGER DEFAULT 20,
  heart_rate_duration_seconds INTEGER DEFAULT 60,
  stress_level_threshold INTEGER DEFAULT 75,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(family_id, student_id)
);

-- Enable RLS
ALTER TABLE public.external_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_sleep_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for external_integrations
CREATE POLICY "Family members can view their integrations"
  ON public.external_integrations FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family owners can manage integrations"
  ON public.external_integrations FOR ALL
  USING (is_family_owner(auth.uid(), family_id))
  WITH CHECK (is_family_owner(auth.uid(), family_id));

-- RLS Policies for wearable_sleep_data
CREATE POLICY "Family members can view sleep data"
  ON public.wearable_sleep_data FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert sleep data"
  ON public.wearable_sleep_data FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

-- RLS Policies for biometric_alerts
CREATE POLICY "Family members can view alerts"
  ON public.biometric_alerts FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can manage alerts"
  ON public.biometric_alerts FOR ALL
  USING (is_family_member(auth.uid(), family_id))
  WITH CHECK (is_family_member(auth.uid(), family_id));

-- RLS Policies for alert_configurations
CREATE POLICY "Family members can view alert config"
  ON public.alert_configurations FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family owners can manage alert config"
  ON public.alert_configurations FOR ALL
  USING (is_family_owner(auth.uid(), family_id))
  WITH CHECK (is_family_owner(auth.uid(), family_id));

-- Add update trigger for updated_at
CREATE TRIGGER update_external_integrations_updated_at
  BEFORE UPDATE ON public.external_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alert_configurations_updated_at
  BEFORE UPDATE ON public.alert_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
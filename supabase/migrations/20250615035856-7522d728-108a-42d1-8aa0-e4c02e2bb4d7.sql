
-- Create analytics_metrics table for time-series data storage
CREATE TABLE public.analytics_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create anomaly_alerts table for storing detected anomalies
CREATE TABLE public.anomaly_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  threshold NUMERIC NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE NULL
);

-- Add indexes for better performance
CREATE INDEX idx_analytics_metrics_user_metric ON public.analytics_metrics (user_id, metric_name);
CREATE INDEX idx_analytics_metrics_timestamp ON public.analytics_metrics (timestamp);
CREATE INDEX idx_anomaly_alerts_user ON public.anomaly_alerts (user_id);
CREATE INDEX idx_anomaly_alerts_resolved ON public.anomaly_alerts (resolved);

-- Enable Row Level Security
ALTER TABLE public.analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_metrics
CREATE POLICY "Users can view their own metrics" 
  ON public.analytics_metrics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics" 
  ON public.analytics_metrics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for anomaly_alerts
CREATE POLICY "Users can view their own anomalies" 
  ON public.anomaly_alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own anomalies" 
  ON public.anomaly_alerts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anomalies" 
  ON public.anomaly_alerts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

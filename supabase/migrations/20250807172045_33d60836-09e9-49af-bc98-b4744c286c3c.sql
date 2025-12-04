-- Create email delivery logs table for monitoring email events
CREATE TABLE public.email_delivery_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  from_address TEXT,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access only (since this is system data)
CREATE POLICY "Service role can manage email logs" 
ON public.email_delivery_logs 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create index for efficient querying
CREATE INDEX idx_email_delivery_logs_email_id ON public.email_delivery_logs(email_id);
CREATE INDEX idx_email_delivery_logs_event_type ON public.email_delivery_logs(event_type);
CREATE INDEX idx_email_delivery_logs_recipient ON public.email_delivery_logs(recipient);
CREATE INDEX idx_email_delivery_logs_created_at ON public.email_delivery_logs(created_at DESC);
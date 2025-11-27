-- Enhance audit_logs table for admin audit trail functionality
ALTER TABLE public.audit_logs 
  ADD COLUMN IF NOT EXISTS actor_email TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure'));

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON public.audit_logs(action_type);

-- Create a function to populate actor_email from user_id
CREATE OR REPLACE FUNCTION public.populate_audit_log_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Auto-populate actor_email from auth.users if not provided
  IF NEW.actor_email IS NULL AND NEW.user_id IS NOT NULL THEN
    SELECT email INTO NEW.actor_email
    FROM auth.users
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-populate actor_email
DROP TRIGGER IF EXISTS populate_audit_log_email_trigger ON public.audit_logs;
CREATE TRIGGER populate_audit_log_email_trigger
  BEFORE INSERT ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.populate_audit_log_email();

-- Grant necessary permissions
GRANT SELECT ON public.audit_logs TO authenticated;

-- Update RLS policy for admins to view all logs
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
  );
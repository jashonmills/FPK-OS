-- Step 1: Critical Security Fixes - Add missing RLS policies and fix security definer issues

-- Add RLS policy for subscribers table
CREATE POLICY "Users can manage their own subscriptions" 
ON public.subscribers 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add RLS policy for user_xp table  
CREATE POLICY "Users can view and update their own XP"
ON public.user_xp
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Add RLS policy for contact_submissions table (already has some policies but may need updates)
CREATE POLICY "Public can create contact submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own contact submissions"
ON public.contact_submissions
FOR SELECT
USING (user_id = auth.uid() OR user_id IS NULL);

-- Add RLS policy for beta_feedback table (already has some policies but ensuring completeness)
CREATE POLICY "Users can create anonymous feedback"
ON public.beta_feedback
FOR INSERT
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Add RLS policy for coupon_redemptions table
CREATE POLICY "Users can view their own coupon redemptions"
ON public.coupon_redemptions
FOR SELECT
USING (user_id = auth.uid());

-- Fix security definer functions to be more secure
-- Update functions that should use SECURITY INVOKER instead of SECURITY DEFINER where appropriate

-- Create a more secure version of user access functions
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(check_user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  subscription_status text;
BEGIN
  -- Only allow users to check their own status unless they're admin
  IF check_user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: Cannot check other user subscription status';
  END IF;
  
  SELECT COALESCE(s.status, 'none') INTO subscription_status
  FROM subscribers s
  WHERE s.user_id = check_user_id;
  
  RETURN COALESCE(subscription_status, 'none');
END;
$$;

-- Update organization access function to be more secure
CREATE OR REPLACE FUNCTION public.user_can_access_org_secure(org_id uuid, check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Only allow checking own access unless admin
  IF check_user_id != auth.uid() AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN false;
  END IF;
  
  -- Check if user is owner or member
  RETURN EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = org_id AND owner_id = check_user_id
  ) OR EXISTS (
    SELECT 1 FROM public.org_members 
    WHERE org_id = user_can_access_org_secure.org_id 
    AND user_id = check_user_id 
    AND status = 'active'
  );
END;
$$;

-- Add missing indexes for better performance on RLS policy queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_xp_user_id ON public.user_xp(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contact_submissions_user_id ON public.contact_submissions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_beta_feedback_user_id ON public.beta_feedback(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coupon_redemptions_user_id ON public.coupon_redemptions(user_id);

-- Add audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive data
  INSERT INTO audit_log (
    user_id, action, table_name, record_id,
    legal_basis, purpose, timestamp
  ) VALUES (
    auth.uid(), TG_OP, TG_TABLE_NAME, 
    COALESCE(NEW.id, OLD.id),
    'legitimate_interest', 
    'Automated security audit log',
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for audit logging on sensitive tables
DROP TRIGGER IF EXISTS audit_subscribers_access ON public.subscribers;
CREATE TRIGGER audit_subscribers_access
  AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();

DROP TRIGGER IF EXISTS audit_user_xp_access ON public.user_xp;  
CREATE TRIGGER audit_user_xp_access
  AFTER INSERT OR UPDATE OR DELETE ON public.user_xp
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();
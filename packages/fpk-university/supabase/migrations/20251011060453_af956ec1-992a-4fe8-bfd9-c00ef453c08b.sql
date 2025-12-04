-- CRITICAL SECURITY FIX: Remove dangerous policy that exposes all subscriber data
-- This policy had USING (true) which made the entire table publicly readable/writable

-- Drop the dangerous policy
DROP POLICY IF EXISTS "Edge functions can manage subscriptions" ON public.subscribers;

-- Verify remaining policies are secure (they should only allow user-specific or admin access)
-- The following policies should remain:
-- 1. "Users can view their own subscription"
-- 2. "Users can insert their own subscription" 
-- 3. "Users can update their own subscription"
-- 4. "Edge functions can update subscriptions" (service role only)
-- 5. "Admins can view all subscriptions"
-- 6. "Admins can manage all subscriptions"

-- Add comment to document this security fix
COMMENT ON TABLE public.subscribers IS 'Contains user subscription data. RLS policies enforce user can only access their own data, with admin override. Edge functions use service role key for operations.';
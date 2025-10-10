-- Add stripe_customer_id to families table for linking Stripe subscriptions
ALTER TABLE public.families 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Add index for faster Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_families_stripe_customer_id 
ON public.families(stripe_customer_id);

-- Add helpful comments explaining the subscription tier structure
COMMENT ON COLUMN public.families.subscription_tier IS 'Subscription tier: free, team, pro';
COMMENT ON COLUMN public.families.max_students IS 'Maximum students allowed: 1 (free), 5 (team), -1 (unlimited/pro)';
COMMENT ON COLUMN public.families.storage_limit_mb IS 'Storage limit in MB: 500 (free), 5120 (team), 20480 (pro)';

-- Function to get max users allowed for each subscription tier
CREATE OR REPLACE FUNCTION public.get_max_users_for_tier(tier TEXT)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE tier
    WHEN 'free' THEN 2
    WHEN 'team' THEN 10
    WHEN 'pro' THEN -1  -- unlimited
    ELSE 2  -- default to free tier limits
  END;
$$;

-- Function to check if a family can invite more members based on their tier
CREATE OR REPLACE FUNCTION public.can_add_family_member(_family_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_tier TEXT;
  max_users INTEGER;
  current_users INTEGER;
BEGIN
  -- Get the family's subscription tier
  SELECT subscription_tier INTO current_tier
  FROM public.families
  WHERE id = _family_id;

  -- Get max users for this tier
  max_users := get_max_users_for_tier(current_tier);

  -- If unlimited (-1), always return true
  IF max_users = -1 THEN
    RETURN TRUE;
  END IF;

  -- Count current family members
  SELECT COUNT(*) INTO current_users
  FROM public.family_members
  WHERE family_id = _family_id;

  -- Check if we're under the limit
  RETURN current_users < max_users;
END;
$$;

-- Function to check if a family can add more students based on their tier
CREATE OR REPLACE FUNCTION public.can_add_student(_family_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  max_students INTEGER;
  current_students INTEGER;
BEGIN
  -- Get the family's max students limit
  SELECT f.max_students INTO max_students
  FROM public.families f
  WHERE id = _family_id;

  -- If unlimited (-1), always return true
  IF max_students = -1 THEN
    RETURN TRUE;
  END IF;

  -- Count current active students
  SELECT COUNT(*) INTO current_students
  FROM public.students
  WHERE family_id = _family_id AND is_active = true;

  -- Check if we're under the limit
  RETURN current_students < max_students;
END;
$$;

-- Function to get subscription tier details
CREATE OR REPLACE FUNCTION public.get_subscription_tier_details(tier TEXT)
RETURNS TABLE (
  tier_name TEXT,
  max_students INTEGER,
  max_users INTEGER,
  storage_limit_mb INTEGER,
  monthly_price NUMERIC,
  annual_price NUMERIC
)
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT 
    tier,
    CASE tier
      WHEN 'free' THEN 1
      WHEN 'team' THEN 5
      WHEN 'pro' THEN -1
      ELSE 1
    END as max_students,
    CASE tier
      WHEN 'free' THEN 2
      WHEN 'team' THEN 10
      WHEN 'pro' THEN -1
      ELSE 2
    END as max_users,
    CASE tier
      WHEN 'free' THEN 500
      WHEN 'team' THEN 5120
      WHEN 'pro' THEN 20480
      ELSE 500
    END as storage_limit_mb,
    CASE tier
      WHEN 'free' THEN 0
      WHEN 'team' THEN 25
      WHEN 'pro' THEN 60
      ELSE 0
    END as monthly_price,
    CASE tier
      WHEN 'free' THEN 0
      WHEN 'team' THEN 255
      WHEN 'pro' THEN 612
      ELSE 0
    END as annual_price
$$;
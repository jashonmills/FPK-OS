-- Fix search_path security warnings for immutable functions

-- Update get_max_users_for_tier function with search_path
CREATE OR REPLACE FUNCTION public.get_max_users_for_tier(tier TEXT)
RETURNS INTEGER
LANGUAGE SQL
IMMUTABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT CASE tier
    WHEN 'free' THEN 2
    WHEN 'team' THEN 10
    WHEN 'pro' THEN -1  -- unlimited
    ELSE 2  -- default to free tier limits
  END;
$$;

-- Update get_subscription_tier_details function with search_path
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
SECURITY DEFINER
SET search_path = ''
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
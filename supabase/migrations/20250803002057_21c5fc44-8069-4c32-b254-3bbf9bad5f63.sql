-- Create subscription tiers enum
CREATE TYPE public.subscription_tier AS ENUM ('basic', 'pro', 'premium');

-- Create subscription status enum  
CREATE TYPE public.subscription_status AS ENUM ('active', 'canceled', 'past_due', 'incomplete', 'trialing');

-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier subscription_tier,
  subscription_status subscription_status DEFAULT 'incomplete',
  subscription_id TEXT,
  subscription_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create coupon codes table for free access
CREATE TABLE public.coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_percent INTEGER, -- NULL for free access codes
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  subscription_tier subscription_tier, -- Which tier this coupon unlocks
  duration_months INTEGER, -- How many months of free access
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create coupon redemptions table
CREATE TABLE public.coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_id UUID REFERENCES public.coupon_codes(id),
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, coupon_id)
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Edge functions can manage subscriptions" ON public.subscribers
FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for coupon codes
CREATE POLICY "Anyone can view active coupons" ON public.coupon_codes
FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can manage coupons" ON public.coupon_codes
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for coupon redemptions
CREATE POLICY "Users can view their own redemptions" ON public.coupon_redemptions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create redemptions" ON public.coupon_redemptions
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Edge functions can manage redemptions" ON public.coupon_redemptions
FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coupon_codes_updated_at
BEFORE UPDATE ON public.coupon_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default coupon codes for free access
INSERT INTO public.coupon_codes (code, description, subscription_tier, duration_months, is_active) VALUES
('BETA2025', 'Beta Access - 3 Months Free Premium', 'premium', 3, true),
('FREEMONTH', 'One Month Free Basic Access', 'basic', 1, true),
('WELCOME', 'Welcome Gift - 1 Month Pro', 'pro', 1, true);
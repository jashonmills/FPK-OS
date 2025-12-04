-- Create AI credit costs configuration table
CREATE TABLE IF NOT EXISTS public.ai_credit_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL UNIQUE,
  action_name TEXT NOT NULL,
  credits_per_unit NUMERIC NOT NULL,
  unit_description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_credit_costs ENABLE ROW LEVEL SECURITY;

-- All users can view credit costs
CREATE POLICY "Users can view credit costs"
ON public.ai_credit_costs
FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage credit costs
CREATE POLICY "Admins can manage credit costs"
ON public.ai_credit_costs
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial credit costs
INSERT INTO public.ai_credit_costs (action_type, action_name, credits_per_unit, unit_description) VALUES
('tts', 'Text-to-Speech', 1, 'per 1,000 characters'),
('stt', 'Speech-to-Text', 1, 'per 30 seconds of audio'),
('chat_simple', 'Simple AI Chat Query', 10, 'per query'),
('chat_rag', 'Complex AI Chat Query (with RAG)', 35, 'per query'),
('document_analysis', 'Full Document Analysis', 250, 'per document'),
('daily_briefing', 'Daily AI Briefing', 50, 'per briefing'),
('goal_activities', 'Goal Activity Suggestions', 20, 'per goal')
ON CONFLICT (action_type) DO NOTHING;

-- Create AI credit ledger table for tracking all transactions
CREATE TABLE IF NOT EXISTS public.ai_credit_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  action_type TEXT NOT NULL,
  credits_changed NUMERIC NOT NULL, -- Positive for credits added, negative for usage
  balance_monthly_before NUMERIC NOT NULL,
  balance_purchased_before NUMERIC NOT NULL,
  balance_monthly_after NUMERIC NOT NULL,
  balance_purchased_after NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_credit_ledger ENABLE ROW LEVEL SECURITY;

-- Family members can view their ledger
CREATE POLICY "Family members can view their credit ledger"
ON public.ai_credit_ledger
FOR SELECT
TO authenticated
USING (is_family_member(auth.uid(), family_id));

-- System can insert transactions
CREATE POLICY "System can insert credit transactions"
ON public.ai_credit_ledger
FOR INSERT
TO authenticated
WITH CHECK (is_family_member(auth.uid(), family_id));

-- Create index for faster queries
CREATE INDEX idx_credit_ledger_family_date ON public.ai_credit_ledger(family_id, transaction_date DESC);

-- Create AI credit balances table (current balances)
CREATE TABLE IF NOT EXISTS public.ai_credit_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL UNIQUE REFERENCES public.families(id) ON DELETE CASCADE,
  monthly_credits NUMERIC NOT NULL DEFAULT 0,
  purchased_credits NUMERIC NOT NULL DEFAULT 0,
  monthly_allowance NUMERIC NOT NULL DEFAULT 400, -- Based on subscription tier
  last_monthly_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_credit_balances ENABLE ROW LEVEL SECURITY;

-- Family members can view their balance
CREATE POLICY "Family members can view their credit balance"
ON public.ai_credit_balances
FOR SELECT
TO authenticated
USING (is_family_member(auth.uid(), family_id));

-- Family members can update their balance (through functions only)
CREATE POLICY "System can update credit balances"
ON public.ai_credit_balances
FOR UPDATE
TO authenticated
USING (is_family_member(auth.uid(), family_id));

-- Family owners can insert balance
CREATE POLICY "Family owners can insert credit balance"
ON public.ai_credit_balances
FOR INSERT
TO authenticated
WITH CHECK (is_family_owner(auth.uid(), family_id));

-- Create function to get monthly allowance based on tier
CREATE OR REPLACE FUNCTION get_monthly_credit_allowance(tier TEXT)
RETURNS NUMERIC
LANGUAGE SQL
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE tier
    WHEN 'free' THEN 400
    WHEN 'team' THEN 2000
    WHEN 'pro' THEN 6000
    ELSE 400
  END;
$$;

-- Create atomic function to consume credits
CREATE OR REPLACE FUNCTION consume_ai_credits(
  p_family_id UUID,
  p_action_type TEXT,
  p_credits_required NUMERIC,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance RECORD;
  v_monthly_deduct NUMERIC;
  v_purchased_deduct NUMERIC;
  v_new_monthly NUMERIC;
  v_new_purchased NUMERIC;
BEGIN
  -- Lock the balance row for update
  SELECT monthly_credits, purchased_credits, monthly_allowance
  INTO v_balance
  FROM ai_credit_balances
  WHERE family_id = p_family_id
  FOR UPDATE;

  -- If no balance exists, create one
  IF NOT FOUND THEN
    INSERT INTO ai_credit_balances (family_id, monthly_credits, monthly_allowance)
    SELECT p_family_id, get_monthly_credit_allowance(subscription_tier), get_monthly_credit_allowance(subscription_tier)
    FROM families WHERE id = p_family_id
    RETURNING monthly_credits, purchased_credits, monthly_allowance INTO v_balance;
  END IF;

  -- Check if sufficient credits
  IF (v_balance.monthly_credits + v_balance.purchased_credits) < p_credits_required THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'required', p_credits_required,
      'available', v_balance.monthly_credits + v_balance.purchased_credits
    );
  END IF;

  -- Deduct from monthly credits first, then purchased
  IF v_balance.monthly_credits >= p_credits_required THEN
    v_monthly_deduct := p_credits_required;
    v_purchased_deduct := 0;
  ELSE
    v_monthly_deduct := v_balance.monthly_credits;
    v_purchased_deduct := p_credits_required - v_balance.monthly_credits;
  END IF;

  v_new_monthly := v_balance.monthly_credits - v_monthly_deduct;
  v_new_purchased := v_balance.purchased_credits - v_purchased_deduct;

  -- Update balance
  UPDATE ai_credit_balances
  SET 
    monthly_credits = v_new_monthly,
    purchased_credits = v_new_purchased,
    updated_at = now()
  WHERE family_id = p_family_id;

  -- Record transaction
  INSERT INTO ai_credit_ledger (
    family_id,
    action_type,
    credits_changed,
    balance_monthly_before,
    balance_purchased_before,
    balance_monthly_after,
    balance_purchased_after,
    metadata
  ) VALUES (
    p_family_id,
    p_action_type,
    -p_credits_required,
    v_balance.monthly_credits,
    v_balance.purchased_credits,
    v_new_monthly,
    v_new_purchased,
    p_metadata
  );

  RETURN jsonb_build_object(
    'success', true,
    'credits_consumed', p_credits_required,
    'monthly_deducted', v_monthly_deduct,
    'purchased_deducted', v_purchased_deduct,
    'new_monthly_balance', v_new_monthly,
    'new_purchased_balance', v_new_purchased,
    'total_remaining', v_new_monthly + v_new_purchased
  );
END;
$$;

-- Create function to add purchased credits
CREATE OR REPLACE FUNCTION add_purchased_credits(
  p_family_id UUID,
  p_credits_to_add NUMERIC,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance RECORD;
  v_new_purchased NUMERIC;
BEGIN
  -- Lock the balance row for update
  SELECT monthly_credits, purchased_credits
  INTO v_balance
  FROM ai_credit_balances
  WHERE family_id = p_family_id
  FOR UPDATE;

  -- If no balance exists, create one
  IF NOT FOUND THEN
    INSERT INTO ai_credit_balances (family_id, monthly_credits, purchased_credits, monthly_allowance)
    SELECT p_family_id, get_monthly_credit_allowance(subscription_tier), p_credits_to_add, get_monthly_credit_allowance(subscription_tier)
    FROM families WHERE id = p_family_id
    RETURNING monthly_credits, purchased_credits INTO v_balance;
    
    v_new_purchased := p_credits_to_add;
  ELSE
    v_new_purchased := v_balance.purchased_credits + p_credits_to_add;
    
    -- Update balance
    UPDATE ai_credit_balances
    SET 
      purchased_credits = v_new_purchased,
      updated_at = now()
    WHERE family_id = p_family_id;
  END IF;

  -- Record transaction
  INSERT INTO ai_credit_ledger (
    family_id,
    action_type,
    credits_changed,
    balance_monthly_before,
    balance_purchased_before,
    balance_monthly_after,
    balance_purchased_after,
    metadata
  ) VALUES (
    p_family_id,
    'purchased_pack',
    p_credits_to_add,
    v_balance.monthly_credits,
    COALESCE(v_balance.purchased_credits, 0),
    v_balance.monthly_credits,
    v_new_purchased,
    p_metadata
  );

  RETURN jsonb_build_object(
    'success', true,
    'credits_added', p_credits_to_add,
    'new_purchased_balance', v_new_purchased,
    'total_balance', v_balance.monthly_credits + v_new_purchased
  );
END;
$$;

-- Create function to reset monthly credits
CREATE OR REPLACE FUNCTION reset_monthly_credits(p_family_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowance NUMERIC;
BEGIN
  -- Get the family's monthly allowance based on tier
  SELECT get_monthly_credit_allowance(subscription_tier)
  INTO v_allowance
  FROM families
  WHERE id = p_family_id;

  -- Update the balance
  UPDATE ai_credit_balances
  SET 
    monthly_credits = v_allowance,
    monthly_allowance = v_allowance,
    last_monthly_reset = now(),
    updated_at = now()
  WHERE family_id = p_family_id;

  -- Record transaction
  INSERT INTO ai_credit_ledger (
    family_id,
    action_type,
    credits_changed,
    balance_monthly_before,
    balance_purchased_before,
    balance_monthly_after,
    balance_purchased_after,
    metadata
  )
  SELECT 
    family_id,
    'monthly_reset',
    v_allowance,
    0,
    purchased_credits,
    v_allowance,
    purchased_credits,
    jsonb_build_object('reset_date', now())
  FROM ai_credit_balances
  WHERE family_id = p_family_id;
END;
$$;

-- Create trigger to update updated_at
CREATE TRIGGER update_ai_credit_balances_updated_at
  BEFORE UPDATE ON public.ai_credit_balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_credit_costs_updated_at
  BEFORE UPDATE ON public.ai_credit_costs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
-- Phase 1.1: Add credits column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS ai_credits INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_ai_credits ON public.profiles(ai_credits);

-- Phase 1.2: Create credit transactions table
CREATE TABLE IF NOT EXISTS public.ai_credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON public.ai_credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.ai_credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_type ON public.ai_credit_transactions(transaction_type);

ALTER TABLE public.ai_credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.ai_credit_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
  ON public.ai_credit_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all transactions"
  ON public.ai_credit_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Phase 1.3: Create credit management functions
CREATE OR REPLACE FUNCTION public.deduct_ai_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_session_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  SELECT ai_credits INTO v_current_balance
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;
  
  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'current_balance', v_current_balance,
      'required', p_amount
    );
  END IF;
  
  v_new_balance := v_current_balance - p_amount;
  
  UPDATE public.profiles
  SET ai_credits = v_new_balance,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  INSERT INTO public.ai_credit_transactions (
    user_id, amount, balance_before, balance_after,
    transaction_type, session_id, metadata
  ) VALUES (
    p_user_id, -p_amount, v_current_balance, v_new_balance,
    p_transaction_type, p_session_id, p_metadata
  ) RETURNING id INTO v_transaction_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'balance_before', v_current_balance,
    'balance_after', v_new_balance
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.deduct_ai_credits TO authenticated;

CREATE OR REPLACE FUNCTION public.add_ai_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  SELECT ai_credits INTO v_current_balance
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;
  
  v_new_balance := v_current_balance + p_amount;
  
  UPDATE public.profiles
  SET ai_credits = v_new_balance,
      updated_at = NOW()
  WHERE id = p_user_id;
  
  INSERT INTO public.ai_credit_transactions (
    user_id, amount, balance_before, balance_after,
    transaction_type, metadata
  ) VALUES (
    p_user_id, p_amount, v_current_balance, v_new_balance,
    p_transaction_type, p_metadata
  ) RETURNING id INTO v_transaction_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'balance_before', v_current_balance,
    'balance_after', v_new_balance
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_ai_credits TO authenticated;

CREATE OR REPLACE FUNCTION public.get_ai_credits(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(ai_credits, 0)
  FROM public.profiles
  WHERE id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_ai_credits TO authenticated;

-- Phase 1.4: Admin bypass function
CREATE OR REPLACE FUNCTION public.is_admin_or_coach_user(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id
    AND role IN ('admin', 'ai_coach_user')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_or_coach_user TO authenticated;

-- Ensure jashon@fpkuniversity.com has admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'jashon@fpkuniversity.com'
ON CONFLICT (user_id, role) DO NOTHING;
-- Bypass credit checks for developer account (jashonmills@yahoo.com)
CREATE OR REPLACE FUNCTION public.consume_ai_credits(
  p_family_id uuid, 
  p_action_type text, 
  p_credits_required numeric, 
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_balance RECORD;
  v_monthly_deduct NUMERIC;
  v_purchased_deduct NUMERIC;
  v_new_monthly NUMERIC;
  v_new_purchased NUMERIC;
  v_is_developer_account BOOLEAN;
BEGIN
  -- Check if this is the developer account (jashonmills@yahoo.com's family)
  v_is_developer_account := (p_family_id = '4f03de1c-eb61-4ad5-885d-090cd8b29464');
  
  -- If developer account, bypass credit checks and return success
  IF v_is_developer_account THEN
    RETURN jsonb_build_object(
      'success', true,
      'credits_consumed', 0,
      'developer_bypass', true,
      'message', 'Developer account - no credits consumed'
    );
  END IF;

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
      'available', v_balance.monthly_credits + v_balance.purchased_credits,
      'remaining_credits', v_balance.monthly_credits + v_balance.purchased_credits
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
$function$;
-- Function to sync credit allowance when subscription tier changes
CREATE OR REPLACE FUNCTION sync_credit_allowance_on_tier_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_allowance NUMERIC;
BEGIN
  -- Only proceed if subscription_tier changed
  IF OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier THEN
    -- Get the new monthly allowance
    v_new_allowance := get_monthly_credit_allowance(NEW.subscription_tier);
    
    -- Update or create credit balance
    INSERT INTO ai_credit_balances (family_id, monthly_credits, monthly_allowance)
    VALUES (NEW.id, v_new_allowance, v_new_allowance)
    ON CONFLICT (family_id)
    DO UPDATE SET
      monthly_allowance = v_new_allowance,
      -- Reset monthly credits to the new allowance on tier upgrade
      monthly_credits = CASE
        WHEN v_new_allowance > EXCLUDED.monthly_allowance THEN v_new_allowance
        ELSE ai_credit_balances.monthly_credits
      END,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to sync credits when tier changes
DROP TRIGGER IF EXISTS trigger_sync_credit_allowance ON families;
CREATE TRIGGER trigger_sync_credit_allowance
  AFTER UPDATE ON families
  FOR EACH ROW
  EXECUTE FUNCTION sync_credit_allowance_on_tier_change();

-- Immediately sync all existing families to correct allowances
UPDATE ai_credit_balances acb
SET 
  monthly_allowance = get_monthly_credit_allowance(f.subscription_tier),
  monthly_credits = GREATEST(acb.monthly_credits, get_monthly_credit_allowance(f.subscription_tier)),
  updated_at = now()
FROM families f
WHERE acb.family_id = f.id
  AND acb.monthly_allowance != get_monthly_credit_allowance(f.subscription_tier);
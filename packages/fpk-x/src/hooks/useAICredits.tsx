import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFamily } from '@/contexts/FamilyContext';

interface CreditBalance {
  monthly_credits: number;
  purchased_credits: number;
  monthly_allowance: number;
  total_credits: number;
  last_monthly_reset: string;
}

interface CreditCost {
  action_type: string;
  action_name: string;
  credits_per_unit: number;
  unit_description: string;
}

export const useAICredits = () => {
  const { selectedFamily } = useFamily();
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [costs, setCosts] = useState<CreditCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!selectedFamily) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('ai_credit_balances')
        .select('*')
        .eq('family_id', selectedFamily.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setBalance({
          monthly_credits: Number(data.monthly_credits),
          purchased_credits: Number(data.purchased_credits),
          monthly_allowance: Number(data.monthly_allowance),
          total_credits: Number(data.monthly_credits) + Number(data.purchased_credits),
          last_monthly_reset: data.last_monthly_reset,
        });
      } else {
        // Initialize balance if it doesn't exist
        const { data: newBalance } = await supabase
          .from('ai_credit_balances')
          .insert({
            family_id: selectedFamily.id,
            monthly_credits: 400,
            monthly_allowance: 400,
            purchased_credits: 0,
          })
          .select()
          .single();

        if (newBalance) {
          setBalance({
            monthly_credits: Number(newBalance.monthly_credits),
            purchased_credits: Number(newBalance.purchased_credits),
            monthly_allowance: Number(newBalance.monthly_allowance),
            total_credits: Number(newBalance.monthly_credits) + Number(newBalance.purchased_credits),
            last_monthly_reset: newBalance.last_monthly_reset,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching credit balance:', err);
      setError('Failed to load credit balance');
    } finally {
      setLoading(false);
    }
  };

  const fetchCosts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('ai_credit_costs')
        .select('*')
        .eq('is_active', true)
        .order('action_type');

      if (fetchError) throw fetchError;

      if (data) {
        setCosts(data.map(cost => ({
          action_type: cost.action_type,
          action_name: cost.action_name,
          credits_per_unit: Number(cost.credits_per_unit),
          unit_description: cost.unit_description,
        })));
      }
    } catch (err) {
      console.error('Error fetching credit costs:', err);
    }
  };

  useEffect(() => {
    if (selectedFamily) {
      fetchBalance();
      fetchCosts();

      // Subscribe to balance changes
      const channel = supabase
        .channel('credit_balance_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'ai_credit_balances',
            filter: `family_id=eq.${selectedFamily.id}`,
          },
          () => {
            fetchBalance();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedFamily?.id]);

  const getCostForAction = (actionType: string): number | null => {
    const cost = costs.find(c => c.action_type === actionType);
    return cost ? cost.credits_per_unit : null;
  };

  const canAfford = (actionType: string, units: number = 1): boolean => {
    const cost = getCostForAction(actionType);
    if (!cost || !balance) return false;
    return balance.total_credits >= cost * units;
  };

  const getInsufficientCreditsMessage = (actionType: string, units: number = 1): string => {
    const cost = getCostForAction(actionType);
    if (!cost || !balance) return 'Unable to calculate credit cost';
    
    const required = cost * units;
    const shortfall = required - balance.total_credits;
    
    return `This action requires ${required} credits, but you only have ${balance.total_credits} credits. You need ${shortfall} more credits.`;
  };

  return {
    balance,
    costs,
    loading,
    error,
    refresh: fetchBalance,
    getCostForAction,
    canAfford,
    getInsufficientCreditsMessage,
  };
};

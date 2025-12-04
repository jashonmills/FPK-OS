import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CreditBalance {
  credits: number;
  is_admin: boolean;
  unlimited: boolean;
}

export function useCreditBalance() {
  const { user, session } = useAuth();

  const { data, isLoading, error, refetch } = useQuery<CreditBalance>({
    queryKey: ['credit-balance', user?.id],
    queryFn: async () => {
      if (!user || !session) {
        return { credits: 0, is_admin: false, unlimited: false };
      }

      const { data, error } = await supabase.functions.invoke('get-credit-balance', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Credit balance check error:', error);
        throw error;
      }

      return data as CreditBalance;
    },
    enabled: !!user && !!session,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 30, // Refresh every 30 seconds
  });

  return {
    balance: data?.credits || 0,
    isAdmin: data?.is_admin || false,
    isUnlimited: data?.unlimited || false,
    isLoading,
    error,
    refetch
  };
}

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: 'calm' | 'me' | 'us' | 'universal' | null;
  subscription_status?: string;
  subscription_end?: string;
  cancel_at_period_end?: boolean;
  current_period_start?: string;
  current_period_end?: string;
  source?: 'stripe' | 'coupon';
}

export function useSubscription() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: subscription, isLoading, error, refetch } = useQuery({
    queryKey: ['subscription', user?.id, refreshTrigger],
    queryFn: async (): Promise<SubscriptionData> => {
      if (!user || !session) {
        return { subscribed: false };
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Subscription check error:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user && !!session,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  const createCheckout = async (tier: 'me' | 'us' | 'universal', interval: 'monthly' | 'annual', couponCode?: string) => {
    if (!user || !session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { tier, interval, couponCode },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    // Handle free access coupons
    if (data.freeAccess) {
      setRefreshTrigger(prev => prev + 1);
      toast({
        title: "Success!",
        description: data.message,
      });
      return { success: true, freeAccess: true };
    }

    // Open Stripe checkout in new tab
    if (data.url) {
      window.open(data.url, '_blank');
      return { success: true, url: data.url };
    }

    throw new Error('No checkout URL received');
  };

  const openCustomerPortal = async () => {
    if (!user || !session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    if (data.url) {
      window.open(data.url, '_blank');
    }
  };

  const redeemCoupon = async (couponCode: string) => {
    if (!user || !session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('redeem-coupon', {
      body: { couponCode },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    if (data.success) {
      setRefreshTrigger(prev => prev + 1);
      toast({
        title: "Coupon Redeemed!",
        description: data.message,
      });
    }

    return data;
  };

  const refreshSubscription = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Check if user has access to features based on tier
  const hasFeatureAccess = (requiredTier: 'me' | 'us' | 'universal') => {
    if (!subscription?.subscribed) return false;
    
    const tierLevels = { me: 1, us: 2, universal: 3 };
    const userTierLevel = tierLevels[subscription.subscription_tier || 'me'];
    const requiredTierLevel = tierLevels[requiredTier];
    
    return userTierLevel >= requiredTierLevel;
  };

  return {
    subscription: subscription || { subscribed: false },
    isLoading,
    error,
    createCheckout,
    openCustomerPortal,
    redeemCoupon,
    refreshSubscription,
    hasFeatureAccess,
    refetch
  };
}
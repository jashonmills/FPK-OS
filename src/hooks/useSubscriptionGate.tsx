import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { useEffect, useState } from 'react';
import { useCleanup } from '@/utils/cleanupManager';

interface SubscriptionGateState {
  isLoading: boolean;
  hasAccess: boolean;
  subscriptionData: any;
  shouldRedirectToPlanSelection: boolean;
}

export const useSubscriptionGate = (): SubscriptionGateState => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, isLoading: subscriptionLoading, refreshSubscription } = useSubscription();
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const cleanup = useCleanup('useSubscriptionGate');

  useEffect(() => {
    if (user && !subscriptionLoading && !hasCheckedSubscription) {
      refreshSubscription();
      setHasCheckedSubscription(true);
    }
  }, [user, subscriptionLoading, refreshSubscription, hasCheckedSubscription]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    cleanup.setTimeout(() => {
      if ((authLoading || subscriptionLoading || !hasCheckedSubscription) && !timeoutReached) {
        console.warn('⚠️ Subscription gate timeout reached - stopping loading state');
        setTimeoutReached(true);
      }
    }, 8000); // 8 second timeout
  }, [authLoading, subscriptionLoading, hasCheckedSubscription, timeoutReached, cleanup]);

  const isLoading = (authLoading || subscriptionLoading || !hasCheckedSubscription) && !timeoutReached;
  
  // User has access if they have an active subscription
  const hasAccess = subscription?.subscribed === true;
  
  // Should redirect to plan selection if user is authenticated but has no subscription
  const shouldRedirectToPlanSelection = user && !isLoading && !hasAccess;

  // Debug logging
  console.log('🔐 SubscriptionGate Debug:', {
    user: !!user,
    authLoading,
    subscriptionLoading,
    hasCheckedSubscription,
    isLoading,
    subscription,
    hasAccess,
    shouldRedirectToPlanSelection
  });

  return {
    isLoading,
    hasAccess,
    subscriptionData: subscription,
    shouldRedirectToPlanSelection
  };
};
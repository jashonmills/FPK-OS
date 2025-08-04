import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (user && !subscriptionLoading && !hasCheckedSubscription) {
      refreshSubscription();
      setHasCheckedSubscription(true);
    }
  }, [user, subscriptionLoading, refreshSubscription, hasCheckedSubscription]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if ((authLoading || subscriptionLoading || !hasCheckedSubscription) && !timeoutReached) {
        console.warn('⚠️ Subscription gate timeout reached - stopping loading state');
        setTimeoutReached(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeoutId);
  }, [authLoading, subscriptionLoading, hasCheckedSubscription, timeoutReached]);

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
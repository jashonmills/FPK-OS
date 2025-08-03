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

  useEffect(() => {
    if (user && !subscriptionLoading && !hasCheckedSubscription) {
      refreshSubscription();
      setHasCheckedSubscription(true);
    }
  }, [user, subscriptionLoading, refreshSubscription, hasCheckedSubscription]);

  const isLoading = authLoading || subscriptionLoading || !hasCheckedSubscription;
  
  // User has access if they have an active subscription
  const hasAccess = subscription?.subscribed === true;
  
  // Should redirect to plan selection if user is authenticated but has no subscription
  const shouldRedirectToPlanSelection = user && !isLoading && !hasAccess;

  return {
    isLoading,
    hasAccess,
    subscriptionData: subscription,
    shouldRedirectToPlanSelection
  };
};
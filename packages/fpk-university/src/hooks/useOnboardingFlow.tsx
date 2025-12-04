import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useCleanup } from '@/utils/cleanupManager';

export type OnboardingStep = 
  | 'loading'
  | 'unauthenticated' 
  | 'choose-plan'
  | 'beta-onboarding'
  | 'dashboard';

interface OnboardingFlowState {
  currentStep: OnboardingStep;
  isLoading: boolean;
  error: string | null;
  hasCompletedBetaOnboarding: boolean;
}

export const useOnboardingFlow = () => {
  const { user, loading: authLoading, session } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const cleanup = useCleanup('useOnboardingFlow');
  
  const [state, setState] = useState<OnboardingFlowState>({
    currentStep: 'loading',
    isLoading: true,
    error: null,
    hasCompletedBetaOnboarding: false
  });

  // Check if user has completed beta onboarding
  const checkBetaOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking onboarding status:', error);
        return false;
      }

      return data?.onboarding_completed || false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };

  // Determine current step based on user state
  const determineStep = async (): Promise<OnboardingStep> => {
    console.log('🔍 Determining onboarding step:', { 
      authLoading,
      subscriptionLoading,
      user: !!user, 
      subscription: subscription?.subscribed 
    });

    // Still loading auth state
    if (authLoading) {
      console.log('⏳ Auth still loading...');
      return 'loading';
    }

    // Not authenticated
    if (!user || !session) {
      console.log('➡️ No user/session - going to unauthenticated');
      return 'unauthenticated';
    }

    // Skip subscription check if it's taking too long and user exists
    if (subscriptionLoading) {
      console.log('⏳ Subscription loading, but user exists - proceeding to dashboard');
      return 'dashboard'; // Fallback to dashboard if subscription is taking too long
    }

    // No subscription - need to choose plan
    if (!subscription?.subscribed) {
      console.log('➡️ No subscription - going to choose-plan');
      return 'choose-plan';
    }

    // Has subscription, check beta onboarding
    console.log('🔍 Checking beta onboarding status...');
    try {
      const hasCompletedOnboarding = await checkBetaOnboardingStatus(user.id);
      
      if (!hasCompletedOnboarding) {
        console.log('➡️ Beta onboarding incomplete - going to beta-onboarding');
        return 'beta-onboarding';
      }

      console.log('✅ All checks passed - going to dashboard');
      return 'dashboard';
    } catch (error) {
      console.error('Error checking beta onboarding:', error);
      // Fallback to dashboard if beta check fails
      return 'dashboard';
    }
  };

  // Update flow state with proper dependency management
  useEffect(() => {
    let isMounted = true;
    let timeoutId: string;
    
    const updateFlow = async () => {
      if (!isMounted) return;
      
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Add timeout to prevent infinite loading
        timeoutId = cleanup.setTimeout(() => {
          if (isMounted) {
            console.warn('⚠️ Onboarding flow timeout - forcing fallback navigation');
            const fallbackStep = user ? 'dashboard' : 'unauthenticated';
            setState(prev => ({
              ...prev,
              currentStep: fallbackStep,
              isLoading: false,
              error: 'Loading timeout - using fallback navigation'
            }));
          }
        }, 8000); // 8 second timeout
        
        const step = await determineStep();
        const hasCompletedOnboarding = user ? await checkBetaOnboardingStatus(user.id) : false;
        
        if (!isMounted) return;
        
        cleanup.cleanup(timeoutId);
        setState(prev => ({
          ...prev,
          currentStep: step,
          isLoading: false,
          hasCompletedBetaOnboarding: hasCompletedOnboarding
        }));
        
        console.log('🚀 Onboarding Flow Update:', {
          user: !!user,
          hasSubscription: subscription?.subscribed,
          hasCompletedOnboarding,
          currentStep: step,
          currentPath: location.pathname
        });
        
      } catch (error) {
        if (!isMounted) return;
        cleanup.cleanup(timeoutId);
        console.error('Error determining onboarding step:', error);
        const fallbackStep = user ? 'dashboard' : 'unauthenticated';
        setState(prev => ({
          ...prev,
          currentStep: fallbackStep,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    // Only update if auth and subscription state are stable OR if we've been loading too long
    if (!authLoading && !subscriptionLoading) {
      updateFlow();
    } else {
      // Force update after 10 seconds even if still loading
      const forceUpdateTimeout = cleanup.setTimeout(() => {
        if (isMounted) {
          console.warn('⚠️ Forcing onboarding update due to prolonged loading');
          updateFlow();
        }
      }, 10000);
      
      return () => {
        isMounted = false;
        if (timeoutId) cleanup.cleanup(timeoutId);
      };
    }

    return () => {
      isMounted = false;
      if (timeoutId) cleanup.cleanup(timeoutId);
    };
  }, [user?.id, authLoading, subscription?.subscribed, subscriptionLoading]); // Minimal stable dependencies

  // Navigation helpers
  const navigateToStep = (step: OnboardingStep) => {
    console.log('🔄 OnboardingFlow: Navigating to step:', step);
    
    // Prevent navigation during loading states
    if (state.isLoading) return;
    
    switch (step) {
      case 'unauthenticated':
        navigate('/login', { replace: true });
        break;
      case 'choose-plan':
        navigate('/choose-plan', { replace: true });
        break;
      case 'beta-onboarding':
        // Stay on current page but show onboarding
        break;
      case 'dashboard':
        // Try to restore previous route or go to default
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/dashboard')) {
          // Already on dashboard, don't navigate
          return;
        }
        navigate('/dashboard/learner', { replace: true });
        break;
    }
  };

  const completeOnboarding = async () => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error completing onboarding:', error);
        return false;
      }

      setState(prev => ({
        ...prev,
        hasCompletedBetaOnboarding: true,
        currentStep: 'dashboard'
      }));

      navigate('/dashboard/learner');
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  return {
    ...state,
    navigateToStep,
    completeOnboarding,
    shouldShowBetaOnboarding: state.currentStep === 'beta-onboarding'
  };
};
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { supabase } from '@/integrations/supabase/client';

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
    // Still loading auth state
    if (authLoading || subscriptionLoading) {
      return 'loading';
    }

    // Not authenticated
    if (!user || !session) {
      return 'unauthenticated';
    }

    // No subscription - need to choose plan
    if (!subscription?.subscribed) {
      return 'choose-plan';
    }

    // Has subscription, check beta onboarding
    const hasCompletedOnboarding = await checkBetaOnboardingStatus(user.id);
    
    if (!hasCompletedOnboarding) {
      return 'beta-onboarding';
    }

    // All complete - ready for dashboard
    return 'dashboard';
  };

  // Update flow state with proper dependency management
  useEffect(() => {
    let isMounted = true;
    
    const updateFlow = async () => {
      if (!isMounted) return;
      
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const step = await determineStep();
        const hasCompletedOnboarding = user ? await checkBetaOnboardingStatus(user.id) : false;
        
        if (!isMounted) return;
        
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
        console.error('Error determining onboarding step:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    // Only update if auth and subscription state are stable
    if (!authLoading && !subscriptionLoading) {
      updateFlow();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id, authLoading, subscription?.subscribed, subscriptionLoading]); // Minimal stable dependencies

  // Navigation helpers
  const navigateToStep = (step: OnboardingStep) => {
    switch (step) {
      case 'unauthenticated':
        navigate('/login');
        break;
      case 'choose-plan':
        navigate('/choose-plan');
        break;
      case 'beta-onboarding':
        // Stay on current page but trigger beta onboarding
        break;
      case 'dashboard':
        navigate('/dashboard/learner');
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
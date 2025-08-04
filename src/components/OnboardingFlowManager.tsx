import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import BetaOnboarding from '@/components/beta/BetaOnboarding';

interface OnboardingFlowManagerProps {
  children: React.ReactNode;
}

export const OnboardingFlowManager: React.FC<OnboardingFlowManagerProps> = ({ children }) => {
  const { 
    currentStep, 
    isLoading, 
    shouldShowBetaOnboarding,
    navigateToStep,
    completeOnboarding 
  } = useOnboardingFlow();
  const location = useLocation();

  // Handle automatic navigation based on flow state
  useEffect(() => {
    if (isLoading) return;

    // Don't navigate if we're already on the correct path
    const currentPath = location.pathname;
    
    console.log('🚀 OnboardingFlowManager:', {
      currentStep,
      currentPath,
      shouldShowBetaOnboarding
    });

    // Handle navigation based on current step
    switch (currentStep) {
      case 'unauthenticated':
        if (currentPath !== '/login' && currentPath !== '/' && 
            !currentPath.startsWith('/privacy') && !currentPath.startsWith('/terms')) {
          navigateToStep('unauthenticated');
        }
        break;
      
      case 'choose-plan':
        if (currentPath !== '/choose-plan' && currentPath !== '/subscription') {
          navigateToStep('choose-plan');
        }
        break;
        
      case 'dashboard':
        if (currentPath === '/login' || currentPath === '/choose-plan') {
          navigateToStep('dashboard');
        }
        break;
    }
  }, [currentStep, isLoading, location.pathname, navigateToStep]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Initializing your learning experience...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {shouldShowBetaOnboarding && (
        <BetaOnboarding 
          autoShow={true}
          onComplete={completeOnboarding}
        />
      )}
    </>
  );
};
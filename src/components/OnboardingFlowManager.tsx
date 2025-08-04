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

  // Handle automatic navigation based on flow state - but only when needed
  useEffect(() => {
    if (isLoading || !currentStep) return;

    const currentPath = location.pathname;
    
    // Log but don't spam
    if (currentStep !== 'loading') {
      console.log('🚀 OnboardingFlowManager:', {
        currentStep,
        currentPath,
        shouldShowBetaOnboarding
      });
    }

    // Enhanced protection: Check for any attempts to access dashboard routes when unauthenticated
    const isDashboardRoute = currentPath.startsWith('/dashboard');
    const isProtectedRoute = isDashboardRoute || currentPath.startsWith('/profile') || currentPath.startsWith('/settings');
    
    // Only navigate if we're not where we should be
    switch (currentStep) {
      case 'unauthenticated':
        // Block access to any protected routes when unauthenticated
        if (isProtectedRoute) {
          console.log('🔒 Blocking access to protected route for unauthenticated user:', currentPath);
          navigateToStep('unauthenticated');
        } else if (currentPath !== '/login' && currentPath !== '/' && 
            !currentPath.startsWith('/privacy') && !currentPath.startsWith('/terms') &&
            !currentPath.startsWith('/subscription')) {
          console.log('🔄 Navigating to login from', currentPath);
          navigateToStep('unauthenticated');
        }
        break;
      
      case 'choose-plan':
        // Block dashboard access when user needs to choose a plan
        if (isDashboardRoute) {
          console.log('🔒 Blocking dashboard access - user needs to choose plan');
          navigateToStep('choose-plan');
        } else if (currentPath !== '/choose-plan' && currentPath !== '/subscription') {
          console.log('🔄 Navigating to choose-plan from', currentPath);
          navigateToStep('choose-plan');
        }
        break;
        
      case 'dashboard':
        if (currentPath === '/login' || currentPath === '/choose-plan') {
          console.log('🔄 Navigating to dashboard from', currentPath);
          navigateToStep('dashboard');
        }
        break;
    }
  }, [currentStep, isLoading, location.pathname]); // Added location.pathname to detect all route changes

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
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import BetaOnboarding from '@/components/beta/BetaOnboarding';
import { useCleanup } from '@/utils/cleanupManager';
import { shouldShowBetaFeatures } from '@/lib/featureFlags';

interface OnboardingFlowManagerProps {
  children: React.ReactNode;
}

export const OnboardingFlowManager: React.FC<OnboardingFlowManagerProps> = ({ children }) => {
  const cleanup = useCleanup('OnboardingFlowManager');
  const { 
    currentStep, 
    isLoading, 
    shouldShowBetaOnboarding,
    navigateToStep,
    completeOnboarding 
  } = useOnboardingFlow();
  const location = useLocation();

  // Store intended route for restoration after auth loading
  const [navigationLock, setNavigationLock] = React.useState(false);
  const lastValidRoute = React.useRef<string | null>(null);

  // Handle automatic navigation based on flow state - with debouncing and conflict prevention
  useEffect(() => {
    if (isLoading || !currentStep || navigationLock) return;

    const currentPath = location.pathname;
    
    // Store the last valid route for restoration
    if (!isLoading && currentStep === 'dashboard') {
      lastValidRoute.current = currentPath;
    }
    
    // Removed excessive logging for performance

    // Check route types
    const isDashboardRoute = currentPath.startsWith('/dashboard');
    const isProtectedRoute = isDashboardRoute || currentPath.startsWith('/profile') || currentPath.startsWith('/settings');
    const isPublicRoute = currentPath === '/' || currentPath === '/login' || 
                         currentPath.startsWith('/privacy') || currentPath.startsWith('/terms');
    const isPlanRoute = currentPath.startsWith('/choose-plan') || currentPath.startsWith('/subscription');
    
    // Debounced navigation with lock to prevent conflicts
    const performNavigation = (step: string) => {
      if (navigationLock) return;
      
      setNavigationLock(true);
      cleanup.setTimeout(() => {
        navigateToStep(step as any);
        cleanup.setTimeout(() => setNavigationLock(false), 100);
      }, 50);
    };

    // Only navigate when there's a clear mismatch (not during transitions)
    switch (currentStep) {
      case 'unauthenticated':
        // Only redirect if trying to access protected routes
        if (isProtectedRoute) {
          performNavigation('unauthenticated');
        }
        break;
      
      case 'choose-plan':
        // Only redirect if trying to access dashboard
        if (isDashboardRoute) {
          performNavigation('choose-plan');
        }
        break;
        
      case 'dashboard':
        // Only redirect from auth/plan pages, restore intended route if possible
        if (currentPath === '/login' || currentPath === '/choose-plan') {
          const targetRoute = lastValidRoute.current && lastValidRoute.current.startsWith('/dashboard') 
            ? lastValidRoute.current 
            : '/dashboard/learner';
          performNavigation('dashboard');
        }
        break;
    }
  }, [currentStep, isLoading, location.pathname, navigationLock]);

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
      {shouldShowBetaOnboarding && shouldShowBetaFeatures() && (
        <BetaOnboarding 
          autoShow={true}
          onComplete={completeOnboarding}
        />
      )}
    </>
  );
};
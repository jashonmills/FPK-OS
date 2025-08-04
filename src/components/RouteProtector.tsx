import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionGate } from '@/hooks/useSubscriptionGate';

interface RouteProtectorProps {
  children: React.ReactNode;
}

export const RouteProtector: React.FC<RouteProtectorProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isLoading: subscriptionLoading, hasAccess } = useSubscriptionGate();
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  const currentPath = location.pathname;
  const isDashboardRoute = currentPath.startsWith('/dashboard');
  const isPublicRoute = ['/', '/login', '/choose-plan', '/privacy-policy', '/terms-of-service'].includes(currentPath) ||
                       currentPath.startsWith('/subscription');

  useEffect(() => {
    // Don't do anything until auth and subscription checks are complete
    if (authLoading || subscriptionLoading) {
      return;
    }

    // Mark as initialized once we have definitive auth/subscription status
    if (!isInitialized) {
      setIsInitialized(true);
      console.log('🔐 RouteProtector initialized:', {
        user: !!user,
        hasAccess,
        currentPath,
        isDashboardRoute,
        isPublicRoute
      });
    }

    // Handle route protection after initialization
    if (isInitialized) {
      // If trying to access dashboard without auth, redirect to login
      if (isDashboardRoute && !user) {
        console.log('🔒 Redirecting to login - no auth for dashboard');
        navigate('/login', { replace: true });
        return;
      }

      // If trying to access dashboard without subscription, redirect to plan selection
      if (isDashboardRoute && user && !hasAccess) {
        console.log('🔒 Redirecting to choose-plan - no subscription');
        navigate('/choose-plan', { replace: true });
        return;
      }

      // If authenticated and has access but on login/plan pages, redirect to dashboard
      if (user && hasAccess && (currentPath === '/login' || currentPath === '/choose-plan')) {
        console.log('🔄 Redirecting authenticated user to dashboard');
        navigate('/dashboard/learner', { replace: true });
        return;
      }
    }
  }, [authLoading, subscriptionLoading, user, hasAccess, currentPath, isInitialized, navigate, isDashboardRoute, isPublicRoute]);

  // Show loading while checking auth and subscription
  if (authLoading || subscriptionLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-variant to-accent flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading your learning experience...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
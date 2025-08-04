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
  const [hasNavigated, setHasNavigated] = useState(false);

  const currentPath = location.pathname;
  const isDashboardRoute = currentPath.startsWith('/dashboard');
  const isPublicRoute = ['/', '/login', '/choose-plan', '/privacy-policy', '/terms-of-service'].includes(currentPath) ||
                       currentPath.startsWith('/subscription');

  useEffect(() => {
    // Wait for auth to complete before making any navigation decisions
    if (authLoading) return;

    console.log('🔐 RouteProtector check:', {
      user: !!user,
      authLoading,
      subscriptionLoading,
      hasAccess,
      currentPath,
      isDashboardRoute,
      hasNavigated
    });

    // Only perform navigation once per route change
    if (hasNavigated) return;

    // If not authenticated and trying to access dashboard, redirect to login
    if (isDashboardRoute && !user) {
      console.log('🔒 No auth - redirecting to login');
      setHasNavigated(true);
      navigate('/login', { replace: true });
      return;
    }

    // If authenticated but subscription still loading for dashboard routes, wait
    if (isDashboardRoute && user && subscriptionLoading) {
      return;
    }

    // If authenticated but no subscription access for dashboard, redirect to plan
    if (isDashboardRoute && user && !subscriptionLoading && !hasAccess) {
      console.log('🔒 No subscription - redirecting to choose-plan');
      setHasNavigated(true);
      navigate('/choose-plan', { replace: true });
      return;
    }

    // If authenticated with access but on auth pages, redirect to dashboard
    if (user && !subscriptionLoading && hasAccess && (currentPath === '/login' || currentPath === '/choose-plan')) {
      console.log('🔄 Authenticated user on auth page - redirecting to dashboard');
      setHasNavigated(true);
      navigate('/dashboard/learner', { replace: true });
      return;
    }

    // If authenticated but still loading subscription and on login page, redirect anyway
    // This handles cases where subscription check is taking too long
    if (user && currentPath === '/login' && subscriptionLoading) {
      console.log('🔄 Authenticated user on login page - redirecting to dashboard (subscription loading)');
      setHasNavigated(true);
      navigate('/dashboard/learner', { replace: true });
      return;
    }

  }, [authLoading, subscriptionLoading, user, hasAccess, currentPath, hasNavigated, navigate, isDashboardRoute]);

  // Reset navigation flag when route changes
  useEffect(() => {
    setHasNavigated(false);
  }, [currentPath]);

  // Show loading while checking auth for dashboard routes
  if ((isDashboardRoute && authLoading) || (isDashboardRoute && user && subscriptionLoading)) {
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
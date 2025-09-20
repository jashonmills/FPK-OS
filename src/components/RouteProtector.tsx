import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionGate } from '@/hooks/useSubscriptionGate';
import { safeLocalStorage } from '@/utils/safeStorage';

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
  const isOrgRoute = currentPath.startsWith('/org/');
  const isPublicRoute = ['/', '/login', '/choose-plan', '/privacy-policy', '/terms-of-service'].includes(currentPath) ||
                       currentPath.startsWith('/subscription');

  useEffect(() => {
    // Wait for auth to complete before making any navigation decisions
    if (authLoading) return;

    // Force redirect if stuck in loading state without auth
    if (isDashboardRoute && !user && !authLoading) {
      setHasNavigated(true);
      navigate('/login', { replace: true });
      return;
    }

    // Only perform navigation once per route change
    if (hasNavigated) return;

    // PRIORITY 1: Redirect authenticated users away from login page immediately
    if (user && currentPath === '/login') {
      setHasNavigated(true);
      
      // Check if user has an active organization
      const activeOrgId = safeLocalStorage.getItem<string>('fpk.activeOrgId', {
        fallbackValue: null,
        logErrors: false
      });
      if (activeOrgId) {
        navigate(`/org/${activeOrgId}`, { replace: true });
      } else {
        navigate('/dashboard/learner', { replace: true });
      }
      return;
    }

    // PRIORITY 2: If not authenticated and trying to access dashboard, redirect to login
    if (isDashboardRoute && !user) {
      setHasNavigated(true);
      navigate('/login', { replace: true });
      return;
    }

    // PRIORITY 3: Allow dashboard access for authenticated users, handle subscription later
    if (isDashboardRoute && user && subscriptionLoading) {
      return; // Let them access dashboard, subscription gate will handle restrictions
    }

    // PRIORITY 4: Handle subscription requirements only after user is in dashboard
    if (isDashboardRoute && user && !subscriptionLoading && !hasAccess) {
      setHasNavigated(true);
      navigate('/choose-plan', { replace: true });
      return;
    }

    // PRIORITY 5: Redirect authenticated users with access away from plan page
    if (user && !subscriptionLoading && hasAccess && currentPath === '/choose-plan') {
      setHasNavigated(true);
      
      // Check if user has an active organization
      const activeOrgId = safeLocalStorage.getItem<string>('fpk.activeOrgId', {
        fallbackValue: null,
        logErrors: false
      });
      if (activeOrgId) {
        navigate(`/org/${activeOrgId}`, { replace: true });
      } else {
        navigate('/dashboard/learner', { replace: true });
      }
      return;
    }

    // PRIORITY 6: Auto-redirect to correct context (org vs personal)
    if (user && !subscriptionLoading && hasAccess) {
      const activeOrgId = safeLocalStorage.getItem<string>('fpk.activeOrgId', {
        fallbackValue: null,
        logErrors: false
      });
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('RouteProtector context check:', {
          currentPath,
          activeOrgId,
          isDashboardRoute,
          isOrgRoute
        });
      }
      
      // If user has active org but is on dashboard route, redirect to org
      if (activeOrgId && activeOrgId !== 'null' && isDashboardRoute) {
        console.log('Redirecting to org route:', `/org/${activeOrgId}`);
        setHasNavigated(true);
        navigate(`/org/${activeOrgId}`, { replace: true });
        return;
      }
      
      // If user has no active org but is on org route, redirect to dashboard
      if (!activeOrgId && isOrgRoute) {
        console.log('Redirecting to personal dashboard');
        setHasNavigated(true);
        navigate('/dashboard/learner', { replace: true });
        return;
      }
    }

  }, [authLoading, subscriptionLoading, user, hasAccess, currentPath, hasNavigated, navigate, isDashboardRoute, isOrgRoute]);

  // Reset navigation flag when route changes
  useEffect(() => {
    setHasNavigated(false);
  }, [currentPath]);

  // Show loading while checking auth for dashboard routes
  // Add timeout protection to prevent infinite loading
  if (isDashboardRoute && (authLoading || (user && subscriptionLoading))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-variant to-accent flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading your learning experience...</p>
          {/* Add debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-sm mt-2 opacity-75">
              Auth: {authLoading ? 'loading' : user ? 'authenticated' : 'not authenticated'} | 
              Subscription: {subscriptionLoading ? 'loading' : hasAccess ? 'active' : 'none'}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
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

  // Check if user is a student portal user - if so, bypass all FPK platform logic
  const isStudentPortalUser = user?.user_metadata?.is_student_portal === true;
  
  // Student portal users should never be processed by RouteProtector
  // They are protected by StudentPortalGuard instead
  if (isStudentPortalUser) {
    return <>{children}</>;
  }

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
      
      // Check for navigation intent from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const intentParam = urlParams.get('intent');
      
      // Check if user has an active organization
      const activeOrgId = safeLocalStorage.getItem<string>('fpk.activeOrgId', {
        fallbackValue: null,
        logErrors: false
      });
      
      // Respect user's intent or preference
      if (intentParam === 'personal' || !activeOrgId) {
        navigate('/dashboard/learner', { replace: true });
      } else {
        navigate(`/org/${activeOrgId}`, { replace: true });
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
      
      // Check for navigation intent from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const intentParam = urlParams.get('intent');
      
      // Check if user has an active organization
      const activeOrgId = safeLocalStorage.getItem<string>('fpk.activeOrgId', {
        fallbackValue: null,
        logErrors: false
      });
      
      // Respect user's intent or preference
      if (intentParam === 'personal' || !activeOrgId) {
        navigate('/dashboard/learner', { replace: true });
      } else {
        navigate(`/org/${activeOrgId}`, { replace: true });
      }
      return;
    }

    // PRIORITY 6: REMOVED AGGRESSIVE AUTO-REDIRECT
    // Only redirect if user explicitly lands on org route without org or dashboard route without org access
    if (user && !subscriptionLoading && hasAccess) {
      // Check URL params FIRST (matches getActiveOrgId() logic)
      const urlParams = new URLSearchParams(window.location.search);
      const orgFromUrl = urlParams.get('org');
      
      // Then check path pattern /org/{orgId}/...
      const pathMatch = currentPath.match(/\/org\/([^\/]+)/);
      const orgFromPath = pathMatch ? pathMatch[1] : null;
      
      // Finally check localStorage
      const activeOrgId = orgFromUrl || orgFromPath || safeLocalStorage.getItem<string>('fpk.activeOrgId', {
        fallbackValue: null,
        logErrors: false
      });
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('RouteProtector context check:', {
          currentPath,
          activeOrgId,
          isDashboardRoute,
          isOrgRoute,
          message: 'Allowing user to stay on intended route'
        });
      }
      
      // Only redirect if user is on org route but has no active org
      if (!activeOrgId && isOrgRoute) {
        console.log('Redirecting to personal dashboard - no active org');
        setHasNavigated(true);
        navigate('/dashboard/learner', { replace: true });
        return;
      }
      
      // Only redirect if user is on a generic org route but doesn't have access to that specific org
      // We'll let individual org pages handle their own access control
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
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useUserIdentity } from '@/hooks/useUserIdentity';
import { useStudentPortalContext } from '@/hooks/useStudentPortalContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { shouldEnforceSubscription } from '@/lib/featureFlags';

interface RouteProtectorProps {
  children: React.ReactNode;
}

// Helper function to define which routes are protected
const isProtectedRoute = (pathname: string) => {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/org');
};

export const RouteProtector: React.FC<RouteProtectorProps> = ({ children }) => {
  const { identity, isLoading } = useUserIdentity();
  const { studentOrgSlug } = useStudentPortalContext();
  const location = useLocation();
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  // Check subscription status for platform users accessing premium features
  useEffect(() => {
    const checkSubscription = async () => {
      if (!identity?.isPlatformUser || !shouldEnforceSubscription() || !identity.userId) {
        setHasSubscription(true); // Not checking, so allow access
        return;
      }

      // Only check subscription for premium routes
      const isPremiumRoute = location.pathname.startsWith('/dashboard/learner');
      if (!isPremiumRoute) {
        setHasSubscription(true);
        return;
      }

      setCheckingSubscription(true);
      try {
        const { data } = await supabase
          .from('subscribers')
          .select('subscription_status')
          .eq('user_id', identity.userId)
          .eq('subscription_status', 'active')
          .maybeSingle();

        setHasSubscription(!!data);
      } catch (error) {
        console.error('[RouteProtector] Error checking subscription:', error);
        setHasSubscription(false);
      } finally {
        setCheckingSubscription(false);
      }
    };

    if (!isLoading) {
      checkSubscription();
    }
  }, [identity, isLoading, location.pathname]);

  // Show loading spinner while identity is being determined
  if (isLoading || checkingSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-variant to-accent flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading your learning experience...</p>
        </div>
      </div>
    );
  }

  // --- FIREWALL LOGIC ---

  // Rule #1: If the user is a "Student-Only" user, they MUST be in their org section
  // If they are anywhere else, force them back to their organization dashboard
  if (identity?.isStudentPortalUser) {
    const orgId = identity.memberships[0]?.orgId;
    if (orgId) {
      const isInOrgRoute = location.pathname.startsWith(`/org/${orgId}`) || location.pathname.startsWith(`/${studentOrgSlug}`);
      const hasOrgParam = location.search.includes(`org=${orgId}`);
      const isCourseRoute = location.pathname.startsWith('/courses/');
      const isPreviewRoute = location.pathname.startsWith('/preview/');
      
      // Allow: org routes, course routes with org param, preview routes with org param
      const isAllowed = isInOrgRoute || (isCourseRoute && hasOrgParam) || (isPreviewRoute && hasOrgParam);
      
      if (!isAllowed) {
        console.warn('[RouteProtector] Student-Only user outside their designated org. Redirecting to:', `/org/${orgId}`);
        return <Navigate to={`/org/${orgId}`} replace />;
      }
    }
  }

  // Rule #2: If the user is NOT logged in, block access to protected routes
  if (!identity?.isLoggedIn && isProtectedRoute(location.pathname)) {
    console.warn('[RouteProtector] Unauthenticated user attempting to access protected route. Redirecting to login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rule #3: Subscription enforcement for premium features (if flag enabled)
  if (
    shouldEnforceSubscription() &&
    identity?.isPlatformUser &&
    location.pathname.startsWith('/dashboard/learner') &&
    hasSubscription === false
  ) {
    console.warn('[RouteProtector] User without subscription attempting to access premium dashboard. Redirecting to hub.');
    return <Navigate to="/hub" replace />;
  }

  // Rule #4: If authenticated platform user on login page, redirect to dashboard
  if (identity?.isPlatformUser && location.pathname === '/login') {
    console.log('[RouteProtector] Authenticated platform user on login page. Redirecting to dashboard.');
    return <Navigate to="/dashboard/learner" replace />;
  }

  // If all checks pass, render the requested page
  return <>{children}</>;
};
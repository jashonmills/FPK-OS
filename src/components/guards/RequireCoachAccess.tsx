import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserRole } from '@/hooks/useUserRole';
import { logger } from '@/utils/logger';

interface RequireCoachAccessProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * RequireCoachAccess - Unified guard for AI Coach Portal
 * 
 * Access granted if:
 * 1. User is admin (bypass all checks)
 * 2. User has ai_coach_user role (direct access)
 * 3. User has active subscription (any tier)
 * 
 * Otherwise, redirect to /choose-plan with upgrade prompt
 */
export function RequireCoachAccess({ 
  children, 
  redirectTo = '/choose-plan'
}: RequireCoachAccessProps) {
  const { user, session, loading: authLoading } = useAuth();
  const { subscription, isLoading: subLoading } = useSubscription();
  const { isAdmin, roles, isLoading: rolesLoading } = useUserRole();
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading || subLoading || rolesLoading) {
        return;
      }

      if (!user || !session) {
        setHasAccess(false);
        return;
      }

      try {
        // Check 1: Admin bypass
        if (isAdmin) {
          logger.info('✅ Admin access granted', 'AUTH', { userId: user.id, roles });
          setHasAccess(true);
          return;
        }

        // Check 2: ai_coach_user role
        const hasCoachRole = roles.includes('ai_coach_user');
        if (hasCoachRole) {
          logger.info('✅ Coach role access granted', 'AUTH', { userId: user.id, roles });
          setHasAccess(true);
          return;
        }

        // Check 3: Active subscription
        if (subscription?.subscribed) {
          logger.info('✅ Subscription access granted', 'AUTH', { 
            userId: user.id, 
            roles 
          });
          setHasAccess(true);
          return;
        }

        // No access
        logger.warn('❌ Access denied - no subscription or role', 'AUTH', { 
          userId: user.id, 
          roles,
          hasSubscription: !!subscription?.subscribed 
        });
        setHasAccess(false);

      } catch (error) {
        logger.error('Error checking coach access', 'AUTH', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [user, session, authLoading, subLoading, rolesLoading, isAdmin, roles, subscription]);

  // Show loading state
  if (authLoading || subLoading || rolesLoading || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to coach landing
  if (!user || !session) {
    return <Navigate to="/coach" state={{ from: location }} replace />;
  }

  // Authenticated but no access - redirect to upgrade
  if (!hasAccess) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location,
          message: 'Subscribe to access the AI Study Coach Pro. Start your 7-day free trial!' 
        }} 
        replace 
      />
    );
  }

  // Has access - render children
  return <>{children}</>;
}

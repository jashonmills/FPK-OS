import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface RequireAICoachRoleProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * RequireAICoachRole - Route guard for AI Coach Portal
 * 
 * Checks if the authenticated user has the 'ai_coach_user' role.
 * Redirects to login page if not authenticated or lacking proper role.
 * 
 * Phase 2: Access Control Implementation
 */
export function RequireAICoachRole({ 
  children, 
  fallback = null, 
  redirectTo = '/coach' 
}: RequireAICoachRoleProps) {
  const { user, session } = useAuth();
  const location = useLocation();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkCoachRole = async () => {
      if (!user || !session) {
        setIsChecking(false);
        setHasRole(false);
        return;
      }

      try {
        // Check if user has ai_coach_user role
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'ai_coach_user')
          .maybeSingle();

        if (error) {
          logger.error('Error checking AI coach role', 'AUTH', error);
          setHasRole(false);
        } else {
          setHasRole(!!data);
        }
      } catch (error) {
        logger.error('Exception checking AI coach role', 'AUTH', error);
        setHasRole(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkCoachRole();
  }, [user, session]);

  // Show loading state while checking role
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to coach login
  if (!user || !session) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Authenticated but no coach role - redirect to coach landing with message
  if (!hasRole) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ 
          from: location,
          message: 'You need AI Coach access to view this page. Please request access or contact support.' 
        }} 
        replace 
      />
    );
  }

  // Has proper role - render children
  return <>{children}</>;
}

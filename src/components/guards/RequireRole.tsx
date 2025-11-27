import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RequireRoleProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RequireRole({ 
  roles, 
  children, 
  fallback = null, 
  redirectTo = '/dashboard' 
}: RequireRoleProps) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Check user roles
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }
      
      return data?.map(r => r.role) || [];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const hasRequiredRole = userRoles?.some(role => roles.includes(role)) || false;

  useEffect(() => {
    // Redirect if user doesn't have required role and loading is complete
    if (!authLoading && !rolesLoading && user && !hasRequiredRole) {
      navigate(redirectTo, { replace: true });
    }
  }, [authLoading, rolesLoading, user, hasRequiredRole, navigate, redirectTo]);

  // Show loading state while checking auth and roles
  if (authLoading || rolesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if no user (handled by auth system)
  if (!user) {
    return null;
  }

  // Show fallback or redirect if user doesn't have required role
  if (!hasRequiredRole) {
    return fallback;
  }

  return <>{children}</>;
}
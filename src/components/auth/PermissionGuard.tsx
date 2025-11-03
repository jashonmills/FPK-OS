import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface PermissionGuardProps {
  permission: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  redirectTo?: string;
}

export const PermissionGuard = ({
  permission,
  requireAll = false,
  fallback = null,
  children,
  redirectTo,
}: PermissionGuardProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();
  const navigate = useNavigate();

  const hasAccess = Array.isArray(permission)
    ? (requireAll ? hasAllPermissions(permission) : hasAnyPermission(permission))
    : hasPermission(permission);

  useEffect(() => {
    if (!loading && !hasAccess && redirectTo) {
      navigate(redirectTo);
    }
  }, [loading, hasAccess, redirectTo, navigate]);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

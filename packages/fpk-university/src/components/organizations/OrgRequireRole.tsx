import React from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { Navigate } from 'react-router-dom';

interface OrgRequireRoleProps {
  roles: Array<'owner' | 'admin' | 'instructor' | 'instructor_aide' | 'viewer' | 'student'>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function OrgRequireRole({ 
  roles, 
  children, 
  fallback = null 
}: OrgRequireRoleProps) {
  const { currentOrg, isPersonalMode, getEffectiveRole } = useOrgContext();
  
  // If in personal mode, redirect to dashboard
  if (isPersonalMode) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If no org context, redirect to dashboard
  if (!currentOrg) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user has required role in current org (using effective role for impersonation)
  const effectiveRole = getEffectiveRole();
  const hasRequiredRole = effectiveRole ? roles.includes(effectiveRole) : false;
  
  if (!hasRequiredRole) {
    // Return fallback or redirect to org home (not dashboard to avoid loops)
    return fallback || <Navigate to={`/org/${currentOrg.organization_id}`} replace />;
  }
  
  return <>{children}</>;
}
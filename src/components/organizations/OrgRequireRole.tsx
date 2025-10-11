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
  const { currentOrg, isPersonalMode } = useOrgContext();
  
  // If in personal mode, redirect to dashboard
  if (isPersonalMode) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If no org context, redirect to dashboard
  if (!currentOrg) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user has required role in current org
  const hasRequiredRole = roles.includes(currentOrg.role);
  
  if (!hasRequiredRole) {
    // Return fallback or redirect to org home (not dashboard to avoid loops)
    return fallback || <Navigate to={`/org/${currentOrg.organization_id}`} replace />;
  }
  
  return <>{children}</>;
}
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useStudentPortalContext } from '@/hooks/useStudentPortalContext';
import { Loader2 } from 'lucide-react';

interface StudentPortalGuardProps {
  children: React.ReactNode;
}

export function StudentPortalGuard({ children }: StudentPortalGuardProps) {
  const { user, loading } = useAuth();
  const { isStudentPortalUser, studentOrgSlug } = useStudentPortalContext();
  const { orgSlug } = useParams<{ orgSlug: string }>();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to org login
  if (!user) {
    return <Navigate to={`/${orgSlug}/login`} replace />;
  }

  // Not a student portal user - redirect to FPK platform
  if (!isStudentPortalUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Student belongs to different org - redirect to their org
  if (studentOrgSlug && studentOrgSlug !== orgSlug) {
    return <Navigate to={`/${studentOrgSlug}/student-portal`} replace />;
  }

  // All checks passed - render the protected content
  return <>{children}</>;
}

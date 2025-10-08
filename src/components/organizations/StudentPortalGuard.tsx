import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useStudentPortalContext } from '@/hooks/useStudentPortalContext';
import { useOptionalOrgContext } from '@/components/organizations/OrgContext';
import { Loader2 } from 'lucide-react';

interface StudentPortalGuardProps {
  children: React.ReactNode;
}

export function StudentPortalGuard({ children }: StudentPortalGuardProps) {
  const { user, loading } = useAuth();
  const { isStudentPortalUser, studentOrgSlug } = useStudentPortalContext();
  const orgContext = useOptionalOrgContext();
  const { orgSlug } = useParams<{ orgSlug: string }>();

  // Show loading state while checking auth and org data
  if (loading || orgContext?.isLoading) {
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

  // Check if user is a regular org student (role='student' in org_members)
  const userOrgMembership = orgContext?.organizations?.find(org => org.organizations.slug === orgSlug);
  const isRegularOrgStudent = userOrgMembership?.role === 'student';

  // Allow access if user is either:
  // 1. A student portal user (special accounts with is_student_portal metadata)
  // 2. OR a regular student in this organization (role='student' in org_members)
  const hasStudentAccess = isStudentPortalUser || isRegularOrgStudent;

  // Not a student - redirect to context PIN login
  if (!hasStudentAccess) {
    console.log('🚫 [StudentPortalGuard] Access denied - redirecting to PIN step-up', {
      isStudentPortalUser,
      isRegularOrgStudent,
      orgSlug,
      redirectTo: `/${orgSlug}/context-login`
    });
    return <Navigate to={`/${orgSlug}/context-login`} replace />;
  }

  // For student portal users, check they're accessing the correct org
  if (isStudentPortalUser && studentOrgSlug && studentOrgSlug !== orgSlug) {
    console.log('🔀 [StudentPortalGuard] Redirecting to correct org', {
      requestedOrg: orgSlug,
      userOrg: studentOrgSlug
    });
    return <Navigate to={`/${studentOrgSlug}/student-portal`} replace />;
  }

  console.log('✅ [StudentPortalGuard] Access granted', {
    isStudentPortalUser,
    isRegularOrgStudent,
    orgSlug
  });

  // All checks passed - render the protected content
  return <>{children}</>;
}

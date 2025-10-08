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

  console.log('🔍 [StudentPortalGuard] State check:', {
    loading,
    hasUser: !!user,
    userEmail: user?.email,
    isStudentPortalUser,
    studentOrgSlug,
    userMetadata: user?.user_metadata,
    orgContextLoading: orgContext?.isLoading
  });

  // CRITICAL: Wait for both auth AND metadata to load
  // User metadata might take an extra moment to propagate after magic link auth
  if (loading || !user || (user.email?.includes('@portal.fpkuniversity.com') && isStudentPortalUser === undefined)) {
    console.log('⏳ [StudentPortalGuard] Waiting for auth/metadata to load');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Additional safety check: If this looks like a student portal user but metadata isn't set
  // (e.g., immediately after magic link authentication), give it a moment to propagate
  if (user.email?.endsWith('@portal.fpkuniversity.com') && !isStudentPortalUser) {
    console.warn('⚠️ [StudentPortalGuard] Student portal email detected but metadata not loaded, retrying...');
    // Force a small delay to allow metadata to propagate
    setTimeout(() => window.location.reload(), 500);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to org login
  if (!user) {
    console.log('🚫 [StudentPortalGuard] No user - redirecting to login');
    return <Navigate to={`/${orgSlug}/login`} replace />;
  }

  // Check if user is a regular org student (for logging purposes)
  const userOrgMembership = orgContext?.organizations?.find(org => org.organizations.slug === orgSlug);
  const isRegularOrgStudent = userOrgMembership?.role === 'student';

  // Primary access check: Is this a student portal user?
  if (!isStudentPortalUser && !isRegularOrgStudent) {
    console.log('🚫 [StudentPortalGuard] Access denied - neither student portal user nor org student', {
      isStudentPortalUser,
      isRegularOrgStudent,
      orgSlug
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

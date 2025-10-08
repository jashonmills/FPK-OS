import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useUserIdentity } from '@/hooks/useUserIdentity';
import { useOrgSession } from '@/hooks/useOrgSession';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface StudentPortalGuardProps {
  children: React.ReactNode;
}

export function StudentPortalGuard({ children }: StudentPortalGuardProps) {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const { identity, isLoading } = useUserIdentity();
  const { session, isValidSession } = useOrgSession();
  const [orgId, setOrgId] = React.useState<string | null>(null);

  // Fetch org ID from slug
  useEffect(() => {
    if (!orgSlug) return;
    
    const fetchOrgId = async () => {
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', orgSlug)
        .maybeSingle();
      
      if (org) {
        setOrgId(org.id);
      }
    };
    
    fetchOrgId();
  }, [orgSlug]);

  console.log('🔍 [StudentPortalGuard] State check:', {
    isLoading,
    hasIdentity: !!identity,
    isStudentPortalUser: identity?.isStudentPortalUser,
    isPlatformUser: identity?.isPlatformUser,
    orgSlug,
    orgId,
    hasSession: !!session,
    isValidSession: isValidSession()
  });

  // Show loading while identity is being determined
  if (isLoading || (!orgId && orgSlug)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- NEW, STRICT ACCESS LOGIC ---

  // Case A: Is this a "Student-Only" user? If so, they always have access to their own portal.
  if (identity?.isStudentPortalUser) {
    const studentOrgId = identity.memberships[0]?.orgId;
    
    // Ensure they're accessing the correct org
    if (studentOrgId && orgId && studentOrgId !== orgId) {
      console.warn('🚫 [StudentPortalGuard] Student-only user accessing wrong org. Redirecting to their org.');
      
      // Find the correct org slug for redirect
      supabase
        .from('organizations')
        .select('slug')
        .eq('id', studentOrgId)
        .maybeSingle()
        .then(({ data: correctOrg }) => {
          if (correctOrg?.slug) {
            window.location.href = `/${correctOrg.slug}/student-portal`;
          }
        });
      
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }
    
    console.log('✅ [StudentPortalGuard] Student-only user - access granted');
    return <>{children}</>;
  }

  // Case B: Is this a "Platform User"? They MUST have a valid, recent org session.
  if (identity?.isPlatformUser) {
    const hasValidSession = isValidSession() && 
                          session?.role === 'student' && 
                          session?.orgId === orgId;
    
    if (hasValidSession) {
      console.log('✅ [StudentPortalGuard] Platform user with valid session - access granted');
      return <>{children}</>;
    }
  }

  // --- DENY BY DEFAULT ---
  // If neither of the above conditions are met, deny access and force PIN entry
  console.warn('🚫 [StudentPortalGuard] Access DENIED. No valid identity or session. Redirecting to PIN step-up.');
  return <Navigate to={`/${orgSlug}/context-login`} replace />;
}

import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface EducatorPortalGuardProps {
  children: React.ReactNode;
}

export function EducatorPortalGuard({ children }: EducatorPortalGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { orgId } = useParams<{ orgId: string }>();
  const [checking, setChecking] = useState(true);
  const [isEducator, setIsEducator] = useState(false);

  useEffect(() => {
    const checkEducatorAccess = async () => {
      if (!user || !orgId) {
        setChecking(false);
        return;
      }

      try {
        // Check if user is an educator in this organization
        const { data: educator, error } = await supabase
          .from('org_educators')
          .select('id, status')
          .eq('linked_user_id', user.id)
          .eq('org_id', orgId)
          .eq('status', 'active')
          .single();

        if (!error && educator) {
          setIsEducator(true);
        }
      } catch (error) {
        console.error('Error checking educator access:', error);
      } finally {
        setChecking(false);
      }
    };

    checkEducatorAccess();
  }, [user, orgId]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/`} replace />;
  }

  if (!isEducator) {
    return <Navigate to={`/org/${orgId}`} replace />;
  }

  return <>{children}</>;
}
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface RequireFpkUniversityAccessProps {
  children: React.ReactNode;
}

/**
 * RequireFpkUniversityAccess - Guard for FPK University Platform
 * 
 * Checks if user has fpk_university_access permission
 * - Granted via add-on purchase (Basic/Pro tier)
 * - Automatically granted for Pro+ tier
 * - Can be manually granted by admins
 */
export function RequireFpkUniversityAccess({ 
  children 
}: RequireFpkUniversityAccessProps) {
  const { user, session, loading } = useAuth();
  const location = useLocation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  
  useEffect(() => {
    async function checkAccess() {
      if (!user || !session) {
        setHasAccess(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_permissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('permission', 'fpk_university_access')
          .maybeSingle();
        
        if (error) {
          logger.error('Error checking FPK University access', 'AUTH', error);
          setHasAccess(false);
          return;
        }
        
        const hasPermission = !!data;
        logger.info(`FPK University access check: ${hasPermission}`, 'AUTH', { userId: user.id });
        setHasAccess(hasPermission);
      } catch (error) {
        logger.error('Error in access check', 'AUTH', error);
        setHasAccess(false);
      }
    }
    
    if (!loading) {
      checkAccess();
    }
  }, [user, session, loading]);
  
  // Show loading state
  if (loading || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // Not authenticated - redirect to login
  if (!user || !session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Authenticated but no access - redirect to add-ons page
  if (!hasAccess) {
    return (
      <Navigate 
        to="/coach/settings/addons" 
        state={{ 
          from: location,
          message: 'Add FPK University access to view this content.' 
        }} 
        replace 
      />
    );
  }
  
  // Has access - render children
  return <>{children}</>;
}

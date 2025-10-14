import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function PostLoginHandler() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;

    const routeUser = async () => {
      console.log('🔀 PostLoginHandler: Routing user based on access scope');
      
      // Add timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.error('PostLoginHandler: Routing timeout, redirecting to login');
        navigate('/login', { replace: true });
      }, 10000); // 10 second timeout
      
      try {
        // 1. Fetch user's profile including access_scope
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('access_scope')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('PostLoginHandler: Profile fetch error', profileError);
          
          // Check if it's an authentication error
          if (profileError.message.includes('JWT') || profileError.message.includes('session')) {
            console.error('PostLoginHandler: Invalid session detected, clearing and redirecting');
            await supabase.auth.signOut({ scope: 'local' });
            localStorage.clear();
            clearTimeout(timeoutId);
            navigate('/login', { replace: true });
            return;
          }
          
          // Fail safe: default to platform access
          clearTimeout(timeoutId);
          navigate('/dashboard/learner', { replace: true });
          return;
        }

        // 2. Platform users get standard dashboard access
        if (!profile || profile.access_scope === 'platform') {
          console.log('✅ PostLoginHandler: Platform user → /dashboard/learner');
          clearTimeout(timeoutId);
          navigate('/dashboard/learner', { replace: true });
          return;
        }

        // 3. Organization-only users need org routing
        if (profile.access_scope === 'organization_only') {
          console.log('🏢 PostLoginHandler: Org-only user, fetching memberships');
          
          const { data: orgs, error: orgError } = await supabase
            .from('org_members')
            .select('org_id, organizations(name)')
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (orgError) {
            console.error('PostLoginHandler: Org fetch error', orgError);
            
            // Check for authentication errors
            if (orgError.message.includes('JWT') || orgError.message.includes('session')) {
              await supabase.auth.signOut({ scope: 'local' });
              localStorage.clear();
              clearTimeout(timeoutId);
              navigate('/login', { replace: true });
              return;
            }
            
            clearTimeout(timeoutId);
            navigate('/no-organization-access', { replace: true });
            return;
          }

          if (!orgs || orgs.length === 0) {
            console.warn('⚠️ PostLoginHandler: Org-only user with no active orgs');
            clearTimeout(timeoutId);
            navigate('/no-organization-access', { replace: true });
            return;
          }

          if (orgs.length === 1) {
            console.log('✅ PostLoginHandler: Single org → direct navigation');
            clearTimeout(timeoutId);
            navigate(`/org/${orgs[0].org_id}`, { replace: true });
            return;
          }

          // Multiple orgs - let user choose
          console.log('🔀 PostLoginHandler: Multiple orgs → picker page');
          clearTimeout(timeoutId);
          navigate('/choose-organization', { replace: true });
          return;
        }

      } catch (error: any) {
        console.error('PostLoginHandler: Unexpected error', error);
        
        // Check if it's an authentication error
        if (error?.message?.includes('JWT') || error?.message?.includes('session')) {
          await supabase.auth.signOut({ scope: 'local' });
          localStorage.clear();
          clearTimeout(timeoutId);
          navigate('/login', { replace: true });
          return;
        }
        
        // Fail safe to platform
        clearTimeout(timeoutId);
        navigate('/dashboard/learner', { replace: true });
      }
    };

    routeUser();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fpk-purple to-fpk-amber">
      <div className="text-white flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <div className="text-lg font-medium">Preparing Your Workspace...</div>
        <div className="text-sm opacity-80">Just a moment while we get everything ready</div>
      </div>
    </div>
  );
}

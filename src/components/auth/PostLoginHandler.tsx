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

    // Safe navigation wrapper to handle browser extension interference
    const safeNavigate = (path: string) => {
      try {
        navigate(path, { replace: true });
      } catch (error) {
        console.error('⚠️ Navigation error (likely browser extension interference):', error);
        // Fallback: Force hard navigation to clear any broken state
        window.location.href = path;
      }
    };

    const routeUser = async () => {
      console.log(`🔀 PostLoginHandler [${new Date().toISOString()}]: Routing user based on access scope`);
      
      timeoutId = setTimeout(() => {
        console.error(`⏱️ PostLoginHandler [${new Date().toISOString()}]: Routing timeout after 10s, redirecting to dashboard`);
        safeNavigate('/dashboard/learner');
      }, 10000); // 10 second timeout for resilience
      
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('access_scope')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('PostLoginHandler: Profile fetch error', profileError);
          clearTimeout(timeoutId);
          navigate('/dashboard/learner', { replace: true });
          return;
        }

        if (!profile || profile.access_scope === 'platform') {
          console.log('✅ PostLoginHandler: Platform user → /dashboard/learner');
          clearTimeout(timeoutId);
          safeNavigate('/dashboard/learner');
          return;
        }

        if (profile.access_scope === 'organization_only') {
          console.log('🏢 PostLoginHandler: Org-only user, fetching memberships');
          
          const { data: orgs, error: orgError } = await supabase
            .from('org_members')
            .select('org_id, organizations(name)')
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (orgError) {
            console.error('PostLoginHandler: Org fetch error', orgError);
            clearTimeout(timeoutId);
            safeNavigate('/no-organization-access');
            return;
          }

          if (!orgs || orgs.length === 0) {
            console.warn('⚠️ PostLoginHandler: Org-only user with no active orgs');
            clearTimeout(timeoutId);
            safeNavigate('/no-organization-access');
            return;
          }

          if (orgs.length === 1) {
            console.log('✅ PostLoginHandler: Single org → direct navigation');
            clearTimeout(timeoutId);
            safeNavigate(`/org/${orgs[0].org_id}`);
            return;
          }

          console.log('🔀 PostLoginHandler: Multiple orgs → picker page');
          clearTimeout(timeoutId);
          safeNavigate('/choose-organization');
          return;
        }

      } catch (error) {
        console.error('❌ PostLoginHandler: Unexpected error', error);
        clearTimeout(timeoutId);
        safeNavigate('/dashboard/learner');
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

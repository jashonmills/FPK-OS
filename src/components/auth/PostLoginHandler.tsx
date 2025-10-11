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

    const routeUser = async () => {
      console.log('🔀 PostLoginHandler: Routing user based on access scope');
      
      try {
        // 1. Fetch user's profile including access_scope
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('access_scope')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('PostLoginHandler: Profile fetch error', profileError);
          // Fail safe: default to platform access
          navigate('/dashboard/learner', { replace: true });
          return;
        }

        // 2. Platform users get standard dashboard access
        if (!profile || profile.access_scope === 'platform') {
          console.log('✅ PostLoginHandler: Platform user → /dashboard/learner');
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
            navigate('/no-organization-access', { replace: true });
            return;
          }

          if (!orgs || orgs.length === 0) {
            console.warn('⚠️ PostLoginHandler: Org-only user with no active orgs');
            navigate('/no-organization-access', { replace: true });
            return;
          }

          if (orgs.length === 1) {
            console.log('✅ PostLoginHandler: Single org → direct navigation');
            navigate(`/org/${orgs[0].org_id}`, { replace: true });
            return;
          }

          // Multiple orgs - let user choose
          console.log('🔀 PostLoginHandler: Multiple orgs → picker page');
          navigate('/choose-organization', { replace: true });
          return;
        }

      } catch (error) {
        console.error('PostLoginHandler: Unexpected error', error);
        // Fail safe to platform
        navigate('/dashboard/learner', { replace: true });
      }
    };

    routeUser();
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

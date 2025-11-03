import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PostLoginHandler() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showExtendedMessage, setShowExtendedMessage] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;
    let extendedMessageTimer: NodeJS.Timeout;
    let elapsedTimer: NodeJS.Timeout;

    // Safe navigation wrapper to handle browser extension interference
    const safeNavigate = (path: string) => {
      const timestamp = new Date().toISOString();
      console.log(`🚀 PostLoginHandler [${timestamp}]: Navigating to ${path}`);
      try {
        navigate(path, { replace: true });
      } catch (error) {
        console.error(`⚠️ PostLoginHandler [${timestamp}]: Navigation error (likely browser extension):`, error);
        // Fallback: Force hard navigation to clear any broken state
        console.log(`🔄 PostLoginHandler [${timestamp}]: Falling back to hard navigation`);
        window.location.href = path;
      }
    };

    // Manual fallback navigation
    const handleManualContinue = () => {
      const timestamp = new Date().toISOString();
      console.log(`👆 PostLoginHandler [${timestamp}]: User triggered manual navigation`);
      safeNavigate('/dashboard/learner');
    };

    // Expose manual continue function for button
    (window as any).__postLoginManualContinue = handleManualContinue;

    // Show extended message after 20 seconds
    extendedMessageTimer = setTimeout(() => {
      const timestamp = new Date().toISOString();
      console.warn(`⏰ PostLoginHandler [${timestamp}]: Extended loading (20s) - showing user feedback`);
      setShowExtendedMessage(true);
    }, 20000);

    // Update elapsed time every second for logging
    const startTime = Date.now();
    elapsedTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);
      if (elapsed % 5 === 0) {
        console.log(`⏱️ PostLoginHandler [${new Date().toISOString()}]: Still routing... ${elapsed}s elapsed`);
      }
    }, 1000);

    const routeUser = async () => {
      const timestamp = new Date().toISOString();
      console.log(`🔀 PostLoginHandler [${timestamp}]: Starting user routing based on access scope`);
      
      timeoutId = setTimeout(() => {
        const timestamp = new Date().toISOString();
        console.error(`⏱️ PostLoginHandler [${timestamp}]: Routing timeout after 10s, redirecting to dashboard`);
        safeNavigate('/dashboard/learner');
      }, 10000); // 10 second timeout for resilience
      
      try {
        const fetchTimestamp = new Date().toISOString();
        console.log(`📡 PostLoginHandler [${fetchTimestamp}]: Fetching user profile...`);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('access_scope')
          .eq('id', user.id)
          .single();

        if (profileError) {
          const errorTimestamp = new Date().toISOString();
          console.error(`❌ PostLoginHandler [${errorTimestamp}]: Profile fetch error`, profileError);
          clearTimeout(timeoutId);
          safeNavigate('/dashboard/learner');
          return;
        }
        
        console.log(`✓ PostLoginHandler [${new Date().toISOString()}]: Profile fetched successfully`);

        if (!profile || profile.access_scope === 'platform') {
          const platformTimestamp = new Date().toISOString();
          console.log(`✅ PostLoginHandler [${platformTimestamp}]: Platform user → /dashboard/learner`);
          clearTimeout(timeoutId);
          safeNavigate('/dashboard/learner');
          return;
        }

        if (profile.access_scope === 'organization_only') {
          const orgTimestamp = new Date().toISOString();
          console.log(`🏢 PostLoginHandler [${orgTimestamp}]: Org-only user, fetching memberships...`);
          
          const { data: orgs, error: orgError } = await supabase
            .from('org_members')
            .select('org_id, organizations(name)')
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (orgError) {
            const orgErrorTimestamp = new Date().toISOString();
            console.error(`❌ PostLoginHandler [${orgErrorTimestamp}]: Org fetch error`, orgError);
            clearTimeout(timeoutId);
            safeNavigate('/no-organization-access');
            return;
          }
          
          console.log(`✓ PostLoginHandler [${new Date().toISOString()}]: Organizations fetched successfully`);

          if (!orgs || orgs.length === 0) {
            const noOrgTimestamp = new Date().toISOString();
            console.warn(`⚠️ PostLoginHandler [${noOrgTimestamp}]: Org-only user with no active orgs`);
            clearTimeout(timeoutId);
            safeNavigate('/no-organization-access');
            return;
          }

          if (orgs.length === 1) {
            const singleOrgTimestamp = new Date().toISOString();
            console.log(`✅ PostLoginHandler [${singleOrgTimestamp}]: Single org → /org/${orgs[0].org_id}`);
            clearTimeout(timeoutId);
            safeNavigate(`/org/${orgs[0].org_id}`);
            return;
          }

          const multiOrgTimestamp = new Date().toISOString();
          console.log(`🔀 PostLoginHandler [${multiOrgTimestamp}]: Multiple orgs → /choose-organization`);
          clearTimeout(timeoutId);
          safeNavigate('/choose-organization');
          return;
        }

      } catch (error) {
        const catchTimestamp = new Date().toISOString();
        console.error(`❌ PostLoginHandler [${catchTimestamp}]: Unexpected error`, error);
        clearTimeout(timeoutId);
        safeNavigate('/dashboard/learner');
      }
    };

    routeUser();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (extendedMessageTimer) clearTimeout(extendedMessageTimer);
      if (elapsedTimer) clearInterval(elapsedTimer);
      delete (window as any).__postLoginManualContinue;
      
      const cleanupTimestamp = new Date().toISOString();
      console.log(`🧹 PostLoginHandler [${cleanupTimestamp}]: Cleanup complete`);
    };
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fpk-purple to-fpk-amber p-4">
      <div className="text-white flex flex-col items-center space-y-4 max-w-md text-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <div className="text-lg font-medium">Preparing Your Workspace...</div>
        <div className="text-sm opacity-80">Just a moment while we get everything ready</div>
        
        {showExtendedMessage && (
          <div className="mt-6 space-y-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <div className="font-medium mb-1">This is taking longer than usual...</div>
                <div className="text-sm opacity-90">
                  We're still setting things up. This might be due to a slow connection or high server load.
                </div>
                {elapsedSeconds > 0 && (
                  <div className="text-xs opacity-70 mt-2">
                    Elapsed time: {elapsedSeconds}s
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => (window as any).__postLoginManualContinue?.()}
              variant="secondary"
              className="w-full bg-white text-fpk-purple hover:bg-white/90"
            >
              Continue to Dashboard
            </Button>
            <div className="text-xs opacity-70">
              If the problem persists, try refreshing the page or contact support.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

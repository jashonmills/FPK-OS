import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timeout to prevent infinite loading on network errors
    const loadingTimeout = setTimeout(() => {
      console.warn("Auth loading timeout - setting loading to false");
      setLoading(false);
    }, 5000); // 5 second timeout

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        clearTimeout(loadingTimeout);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Detect zombie sessions: if we have a session but user doesn't exist in DB
        if (session && event === 'SIGNED_IN') {
          // Defer all async DB operations
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', session.user.id)
                .maybeSingle();

              if (error && error.code === 'PGRST116') {
                // User not found in database - zombie session
                console.warn('⚠ Zombie session detected: user exists in auth but not in database.');
                
                // DEFINITIVE FIX: Check for B2B context before signing out
                const b2bSignupFlow = sessionStorage.getItem('b2b_signup_flow');
                const b2bLoginContext = sessionStorage.getItem('b2b_login_context');
                
                if (b2bSignupFlow === 'true' || b2bLoginContext === 'true') {
                  console.log('✓ Zombie session with B2B context. Allowing redirect to /org/create');
                  // Don't sign out - let the user proceed to org creation
                  // The profile will be created during org setup
                  return;
                }
                
                // No B2B context - force sign out
                console.warn('⚠ Zombie session without B2B context. Forcing sign out.');
                await supabase.auth.signOut();
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/';
                return;
              }
            } catch (err) {
              console.error('Error validating user session:', err);
            }
          }, 0);
        }

        // Handle post-login routing
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("🔐 User signed in. User ID:", session.user.id);
          
          // Use setTimeout to defer the navigation check
          setTimeout(async () => {
            // Safety timeout: if navigation takes >5s, force to default page
            const navigationTimeout = setTimeout(() => {
              console.error('⚠️ Navigation timeout - forcing default redirect');
              const currentPath = window.location.pathname;
              if (currentPath.startsWith('/org/')) {
                navigate('/org/dashboard');
              } else {
                navigate('/overview');
              }
            }, 5000);

            try {
              // PRIORITY 0: Check for B2B context FIRST (before any DB queries)
              const urlParams = new URLSearchParams(window.location.search);
              const urlContext = urlParams.get('context');
              const signupContext = sessionStorage.getItem('b2b_signup_flow');
              const loginContext = sessionStorage.getItem('b2b_login_context');

              if (urlContext === 'b2b' || signupContext === 'true' || loginContext === 'true') {
                console.log("✓ B2B context detected. Redirecting to /org/create");
                sessionStorage.removeItem('b2b_signup_flow');
                sessionStorage.removeItem('b2b_login_context');
                clearTimeout(navigationTimeout);
                navigate('/org/create');
                return;
              }
              
              // Only prevent redirects if already on destination pages
              const currentPath = window.location.pathname;
              if (currentPath === '/pricing-authenticated' || 
                  currentPath === '/org/dashboard' || 
                  currentPath === '/org/students' || 
                  currentPath === '/org/create' ||
                  currentPath === '/org/signup' ||
                  currentPath === '/org/login') {
                clearTimeout(navigationTimeout);
                return;
              }

              // Check for redirect parameter in URL
              const redirectUrl = urlParams.get('redirect');
              
              console.log("🔍 Checking memberships...");
              
              // PRIORITY 1: Check user membership type (B2B vs B2C)
              const [familyMembership, orgMembership] = await Promise.all([
                supabase.from('family_members').select('id').eq('user_id', session.user.id).limit(1),
                supabase.from('organization_members').select('id').eq('user_id', session.user.id).eq('is_active', true).limit(1)
              ]);

              const hasFamily = (familyMembership.data?.length || 0) > 0;
              const hasOrg = (orgMembership.data?.length || 0) > 0;

              console.log("🔍 Membership check - Family:", hasFamily, "Organization:", hasOrg);

              // DUAL MEMBERSHIP PRIORITY: Use current path context to decide
              if (hasOrg && hasFamily) {
                console.log("👥 Dual membership detected");
                clearTimeout(navigationTimeout);
                // If on B2B path or login came from B2B, go to org dashboard
                if (currentPath.startsWith('/org/') || loginContext === 'true') {
                  console.log("✓ Redirecting to /org/dashboard (B2B context)");
                  navigate('/org/dashboard');
                } else {
                  console.log("✓ Redirecting to /overview (B2C context)");
                  navigate('/overview');
                }
                return;
              }

              // B2B FLOW: Pure organization users go straight to org dashboard
              if (hasOrg) {
                console.log("✓ B2B USER: Redirecting to organization dashboard");
                clearTimeout(navigationTimeout);
                navigate('/org/dashboard');
                return;
              }

              // B2C FLOW: Family users need profile setup check
              if (hasFamily) {
                console.log("✓ B2C USER: Checking profile and onboarding status");
                
                // Check if profile setup is complete
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('has_completed_profile_setup')
                  .eq('id', session.user.id)
                  .single();

                // If profile setup is not complete, redirect to profile setup
                if (!profileData?.has_completed_profile_setup) {
                  console.log("📝 Profile setup incomplete. Redirecting to profile-setup.");
                  clearTimeout(navigationTimeout);
                  const profileUrl = redirectUrl 
                    ? `/profile-setup?redirect=${encodeURIComponent(redirectUrl)}`
                    : '/profile-setup';
                  navigate(profileUrl);
                  return;
                }

                // If profile is complete AND redirect exists, go there
                if (redirectUrl) {
                  console.log("✓ Following redirect:", redirectUrl);
                  clearTimeout(navigationTimeout);
                  navigate(redirectUrl);
                  return;
                }

                // Check onboarding status
                const { data: hasCompletedOnboarding } = await supabase.rpc('check_user_onboarding_status');

                clearTimeout(navigationTimeout);
                if (hasCompletedOnboarding) {
                  console.log("✓ Redirecting to overview");
                  navigate('/overview');
                } else {
                  console.log("✓ Redirecting to onboarding");
                  navigate('/onboarding');
                }
                return;
              }

              // NO MEMBERSHIP: Check context before defaulting to B2C
              clearTimeout(navigationTimeout);
              const isB2BPath = currentPath.startsWith('/org/');
              if (isB2BPath) {
                console.log("✗ No membership, B2B path. Redirecting to /org/create");
                navigate('/org/create');
              } else {
                console.log("✗ No membership. Redirecting to onboarding");
                navigate('/onboarding');
              }
            } catch (error) {
              console.error("❌ Navigation error:", error);
              clearTimeout(navigationTimeout);
              navigate('/overview');
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          // Just log the sign out - don't navigate here
          // The signOut function handles navigation to prevent race conditions
          console.log("User signed out event received");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(loadingTimeout);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting session:", error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      });

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    console.log('🚪 Sign out initiated');
    
    try {
      const currentPath = window.location.pathname;
      const isB2BPath = currentPath.startsWith('/org/');
      
      console.log('📍 Current path:', currentPath, '| B2B path:', isB2BPath);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear all state
      setUser(null);
      setSession(null);
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('✅ Sign out successful, redirecting...');
      
      // Use window.location.href for reliable redirect with full page reload
      if (isB2BPath) {
        window.location.href = '/org/login';
      } else {
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Force redirect even on error
      window.location.href = '/auth';
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
};

export const useIsSuperAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['is-super-admin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .rpc('has_super_admin_role', { _user_id: user.id });
      
      if (error) {
        console.error('Error checking super admin status:', error);
        return false;
      }
      
      console.log('✅ [useIsSuperAdmin] RPC result:', data);
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
    initialData: undefined, // Explicitly set initial data
  });
};

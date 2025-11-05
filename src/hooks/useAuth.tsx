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
      async (event, session) => {
        clearTimeout(loadingTimeout);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle post-login routing
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("User signed in. User ID:", session.user.id);
          
          // Use setTimeout to defer the navigation check
          setTimeout(async () => {
            try {
              // Check for B2B signup flow flag FIRST
              const b2bSignupFlow = localStorage.getItem('b2b_signup_flow');
              if (b2bSignupFlow === 'true') {
                console.log("✓ B2B signup flow detected. Redirecting to /org/create");
                localStorage.removeItem('b2b_signup_flow');
                navigate('/org/create');
                return; // CRITICAL: Stop here to prevent further redirects
              }
              
              // Only prevent redirects if already on destination pages, not auth pages
              const currentPath = window.location.pathname;
              if (currentPath === '/pricing-authenticated' || 
                  currentPath === '/org/dashboard' || 
                  currentPath === '/org/students' || 
                  currentPath === '/org/create') {
                return;
              }

              // Check for redirect parameter in URL
              const urlParams = new URLSearchParams(window.location.search);
              const redirectUrl = urlParams.get('redirect');
              
              // PRIORITY 1: Check user membership type (B2B vs B2C) FIRST
              const [familyMembership, orgMembership] = await Promise.all([
                supabase.from('family_members').select('id').eq('user_id', session.user.id).limit(1),
                supabase.from('organization_members').select('id').eq('user_id', session.user.id).eq('is_active', true).limit(1)
              ]);

              const hasFamily = (familyMembership.data?.length || 0) > 0;
              const hasOrg = (orgMembership.data?.length || 0) > 0;

              console.log("🔍 Membership check - Family:", hasFamily, "Organization:", hasOrg);

              // B2B FLOW: Pure organization users go straight to org dashboard
              if (hasOrg && !hasFamily) {
                console.log("✓ B2B USER: Redirecting to organization dashboard");
                navigate('/org/dashboard');
                return; // CRITICAL: Stop here - no profile setup checks for B2B
              }

              // B2C FLOW: Family users need profile setup check
              if (hasFamily) {
                console.log("✓ B2C USER: Checking profile and onboarding status");
                
                // Check if profile setup is complete
                const { data: profileData, error: profileError } = await supabase
                  .from('profiles')
                  .select('has_completed_profile_setup')
                  .eq('id', session.user.id)
                  .single();

                if (profileError) {
                  console.error("Error checking profile setup:", profileError);
                }

                // If profile setup is not complete, redirect to profile setup (preserving redirect param)
                if (!profileData?.has_completed_profile_setup) {
                  console.log("Profile setup incomplete. Redirecting to profile-setup.");
                  const profileUrl = redirectUrl 
                    ? `/profile-setup?redirect=${encodeURIComponent(redirectUrl)}`
                    : '/profile-setup';
                  navigate(profileUrl);
                  return;
                }

                // If profile is complete AND redirect exists, go there (invited member flow)
                if (redirectUrl) {
                  console.log("Profile complete, following redirect:", redirectUrl);
                  navigate(redirectUrl);
                  return;
                }

                // Check onboarding status
                const { data: hasCompletedOnboarding, error } = await supabase.rpc('check_user_onboarding_status');

                if (error) {
                  console.error("Error checking onboarding status:", error);
                  navigate('/overview');
                  return;
                }

                if (hasCompletedOnboarding) {
                  console.log("✓ User has completed onboarding. Redirecting to overview.");
                  navigate('/overview');
                } else {
                  console.log("✗ New user detected. Redirecting to onboarding.");
                  navigate('/onboarding');
                }
                return; // CRITICAL: Stop here
              }

              // NO MEMBERSHIP: New user - redirect to B2C onboarding to create family
              console.log("✗ No membership detected. Redirecting to B2C onboarding.");
              navigate('/onboarding');
            } catch (error) {
              console.error("Exception checking onboarding/profile status:", error);
              console.log("Falling back to dashboard due to exception");
              navigate('/dashboard');
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          const currentPath = window.location.pathname;
          // Don't redirect if user is on B2B auth pages
          if (!currentPath.startsWith('/org/login') && !currentPath.startsWith('/org/signup')) {
            console.log("User signed out. Redirecting to auth.");
            navigate('/auth');
          }
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
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
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

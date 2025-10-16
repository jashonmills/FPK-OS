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
              // Don't redirect if user is on the authenticated pricing page
              const currentPath = window.location.pathname;
              if (currentPath === '/pricing-authenticated') {
                return;
              }

              // Check for redirect parameter in URL
              const urlParams = new URLSearchParams(window.location.search);
              const redirectUrl = urlParams.get('redirect');
              
              // First check if profile setup is complete
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

              // Then check onboarding status
              console.log("Checking onboarding status...");
              const { data: hasCompletedOnboarding, error } = await supabase.rpc('check_user_onboarding_status');

              console.log("RPC call completed. Data:", hasCompletedOnboarding, "Error:", error);

              if (error) {
                console.error("Error checking onboarding status:", error);
                console.log("Falling back to overview due to error");
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
            } catch (error) {
              console.error("Exception checking onboarding/profile status:", error);
              console.log("Falling back to dashboard due to exception");
              navigate('/dashboard');
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out. Redirecting to auth.");
          navigate('/auth');
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
      
      return data;
    },
    enabled: !!user,
  });
};

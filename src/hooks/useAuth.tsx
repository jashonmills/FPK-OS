import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle post-login routing
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("User signed in. User ID:", session.user.id);
          
          // Use setTimeout to defer the navigation check
          setTimeout(async () => {
            try {
              // First check if profile setup is complete
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('has_completed_profile_setup')
                .eq('id', session.user.id)
                .single();

              if (profileError) {
                console.error("Error checking profile setup:", profileError);
              }

              // If profile setup is not complete, redirect to profile setup
              if (!profileData?.has_completed_profile_setup) {
                console.log("Profile setup incomplete. Redirecting to profile-setup.");
                navigate('/profile-setup');
                return;
              }

              // Then check onboarding status
              console.log("Checking onboarding status...");
              const { data: hasCompletedOnboarding, error } = await supabase.rpc('check_user_onboarding_status');

              console.log("RPC call completed. Data:", hasCompletedOnboarding, "Error:", error);

              if (error) {
                console.error("Error checking onboarding status:", error);
                console.log("Falling back to dashboard due to error");
                navigate('/dashboard');
                return;
              }

              if (hasCompletedOnboarding) {
                console.log("✓ User has completed onboarding. Redirecting to dashboard.");
                navigate('/dashboard');
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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

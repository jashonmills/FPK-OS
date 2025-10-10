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
          console.log("User signed in. Checking onboarding status...");
          
          try {
            const { data: hasCompletedOnboarding, error } = await supabase.rpc('check_user_onboarding_status');

            if (error) {
              console.error("Error checking onboarding status:", error);
              navigate('/dashboard'); // Safe fallback
              return;
            }

            if (hasCompletedOnboarding) {
              console.log("User has completed onboarding. Redirecting to dashboard.");
              navigate('/dashboard');
            } else {
              console.log("New user detected. Redirecting to onboarding.");
              navigate('/onboarding');
            }
          } catch (error) {
            console.error("Exception checking onboarding status:", error);
            navigate('/dashboard'); // Safe fallback
          }
        } else if (event === 'SIGNED_OUT') {
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

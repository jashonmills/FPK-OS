import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getRoleFromUser, type AppRole } from '@/lib/auth/roles';
import type { User } from '@supabase/supabase-js';

export function useAppUser() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>('learner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        
        setUser(user);
        setRole(getRoleFromUser(user || undefined));
        setLoading(false);
      } catch (error) {
        console.error('Error getting user:', error);
        if (mounted) {
          setUser(null);
          setRole('learner');
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        const user = session?.user || null;
        setUser(user);
        setRole(getRoleFromUser(user || undefined));
        setLoading(false);
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { 
    user, 
    role, 
    isAdmin: role === 'admin', 
    isInstructor: role === 'instructor',
    isLearner: role === 'learner',
    loading 
  };
}
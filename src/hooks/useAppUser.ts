import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type AppRole } from '@/lib/auth/roles';
import type { User } from '@supabase/supabase-js';

export function useAppUser() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>('learner');
  const [loading, setLoading] = useState(true);

  // Function to get user roles from database
  const getUserRoles = async (userId: string): Promise<AppRole> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return 'learner';
      }

      // Check if user has admin role
      if (data?.some(r => r.role === 'admin')) return 'admin';
      if (data?.some(r => r.role === 'instructor')) return 'instructor';
      if (data?.some(r => r.role === 'learner')) return 'learner';
      
      return 'learner'; // Default fallback
    } catch (error) {
      console.error('Error in getUserRoles:', error);
      return 'learner';
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session and roles
    const getInitialSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        
        setUser(user);
        
        if (user?.id) {
          const userRole = await getUserRoles(user.id);
          if (mounted) {
            setRole(userRole);
          }
        }
        
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
        
        if (user?.id) {
          const userRole = await getUserRoles(user.id);
          if (mounted) {
            setRole(userRole);
          }
        } else {
          setRole('learner');
        }
        
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
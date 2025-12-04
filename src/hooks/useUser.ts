import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

export const useUser = (userId?: string) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<User | null> => {
      if (!userId) return null;
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, display_name, created_at')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      if (!profile) return null;

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) throw rolesError;

      // Get email from auth users - handle gracefully if no admin access
      let email = `${profile.full_name?.toLowerCase().replace(/\s+/g, '.')}@fpkuniversity.com`;
      try {
        const { data: authUser } = await supabase.auth.admin.getUserById(userId);
        if (authUser?.user?.email) {
          email = authUser.user.email;
        }
      } catch (error) {
        console.warn('Unable to fetch user email, using generated email');
      }

      return {
        id: profile.id,
        email,
        full_name: profile.full_name || 'Unknown User',
        display_name: profile.display_name || profile.full_name || 'Unknown User',
        created_at: profile.created_at,
        roles: roles?.map(r => r.role) || []
      };
    },
    enabled: !!userId,
  });

  return {
    user,
    isLoading,
    error
  };
};
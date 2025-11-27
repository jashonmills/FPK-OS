
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useUserRole() {
  const { user } = useAuth();

  const { data: roles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        throw error;
      }

      return data.map(r => r.role);
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute (reduced from 10)
    refetchOnMount: true, // Always refetch on component mount
  });

  const isAdmin = roles.includes('admin');
  const isInstructor = roles.includes('instructor');
  const isLearner = roles.includes('learner');

  return {
    roles,
    isAdmin,
    isInstructor,
    isLearner,
    isLoading,
    error,
    refetch, // Expose refetch for manual cache invalidation
  };
}

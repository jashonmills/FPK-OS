
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface StudyInsight {
  type: 'performance' | 'pattern' | 'recommendation' | 'motivation';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export const useStudyInsights = () => {
  const { user } = useAuth();

  const { data: insights = [], isLoading, error, refetch } = useQuery({
    queryKey: ['study-insights', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase.functions.invoke('generate-study-insights', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error fetching insights:', error);
        // Return empty array instead of throwing to prevent infinite loading
        return [];
      }

      return data?.insights || [];
    },
    enabled: !!user,
    retry: false, // Disable retries to prevent infinite loading on API errors
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour (renamed from cacheTime)
  });

  return {
    insights: insights as StudyInsight[],
    isLoading,
    error,
    refetch,
  };
};

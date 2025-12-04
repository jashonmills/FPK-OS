
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ActivityDistribution {
  name: string;
  value: number;
  color: string;
}

export function useActivityDistribution() {
  const { user } = useAuth();

  const { data: activityDistribution = [], isLoading } = useQuery({
    queryKey: ['activity-distribution', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get last 7 days of study sessions
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .not('completed_at', 'is', null);

      if (error) {
        console.error('Error fetching activity distribution:', error);
        throw error;
      }

      if (sessions.length === 0) return [];

      const totalStudyTime = sessions.reduce((acc, session) => 
        acc + (session.session_duration_seconds || 0), 0) / 60; // Convert to minutes

      if (totalStudyTime === 0) return [];

      // Categorize study activities based on session types
      const memoryTestTime = sessions
        .filter(s => s.session_type === 'memory_test')
        .reduce((acc, s) => acc + (s.session_duration_seconds || 0), 0) / 60;

      const multipleChoiceTime = sessions
        .filter(s => s.session_type === 'multiple_choice')
        .reduce((acc, s) => acc + (s.session_duration_seconds || 0), 0) / 60;

      const timedChallengeTime = sessions
        .filter(s => s.session_type === 'timed_challenge')
        .reduce((acc, s) => acc + (s.session_duration_seconds || 0), 0) / 60;

      const distribution: ActivityDistribution[] = [
        { 
          name: 'Memory Practice', 
          value: Math.round(memoryTestTime), 
          color: '#8B5CF6' 
        },
        { 
          name: 'Multiple Choice', 
          value: Math.round(multipleChoiceTime), 
          color: '#F59E0B' 
        },
        { 
          name: 'Timed Challenges', 
          value: Math.round(timedChallengeTime), 
          color: '#3B82F6' 
        },
      ].filter(item => item.value > 0);

      return distribution;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    activityDistribution,
    isLoading
  };
}

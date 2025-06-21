
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface QuickStatsData {
  totalSessions: number;
  hoursLearned: number;
  booksRead: number;
  goalsMet: number;
}

export const useQuickStatsLive = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['quick-stats-live', user?.id],
    queryFn: async (): Promise<QuickStatsData> => {
      if (!user?.id) {
        return { totalSessions: 0, hoursLearned: 0, booksRead: 0, goalsMet: 0 };
      }

      console.log('🔄 Fetching live quick stats...');

      // Fetch all stats in parallel
      const [studySessionsResult, readingSessionsResult, chatSessionsResult, goalsResult] = await Promise.allSettled([
        // Study sessions count
        supabase
          .from('study_sessions')
          .select('session_duration_seconds', { count: 'exact' })
          .eq('user_id', user.id),
        
        // Reading sessions count and time
        supabase
          .from('reading_sessions')
          .select('duration_seconds', { count: 'exact' })
          .eq('user_id', user.id),
        
        // Chat sessions count
        supabase
          .from('chat_sessions')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id),
        
        // Completed goals count
        supabase
          .from('goals')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('status', 'completed')
      ]);

      let totalSessions = 0;
      let totalSecondsLearned = 0;
      let goalsMet = 0;

      // Process study sessions
      if (studySessionsResult.status === 'fulfilled' && studySessionsResult.value.data) {
        const studyCount = studySessionsResult.value.count || 0;
        totalSessions += studyCount;
        
        const studySeconds = studySessionsResult.value.data.reduce((sum, session) => 
          sum + (session.session_duration_seconds || 0), 0
        );
        totalSecondsLearned += studySeconds;
      }

      // Process reading sessions
      if (readingSessionsResult.status === 'fulfilled' && readingSessionsResult.value.data) {
        const readingCount = readingSessionsResult.value.count || 0;
        totalSessions += readingCount;
        
        const readingSeconds = readingSessionsResult.value.data.reduce((sum, session) => 
          sum + (session.duration_seconds || 0), 0
        );
        totalSecondsLearned += readingSeconds;
      }

      // Process chat sessions
      if (chatSessionsResult.status === 'fulfilled') {
        const chatCount = chatSessionsResult.value.count || 0;
        totalSessions += chatCount;
        // Estimate 10 minutes per chat session
        totalSecondsLearned += chatCount * 600;
      }

      // Process completed goals
      if (goalsResult.status === 'fulfilled') {
        goalsMet = goalsResult.value.count || 0;
      }

      // Calculate books read from reading progress
      const { data: readingProgress } = await supabase
        .from('reading_progress')
        .select('completion_percentage')
        .eq('user_id', user.id)
        .gte('completion_percentage', 90); // Consider 90%+ as "read"

      const booksRead = readingProgress?.length || 0;

      const stats = {
        totalSessions,
        hoursLearned: Math.round(totalSecondsLearned / 3600), // Convert to hours
        booksRead,
        goalsMet
      };

      console.log('✅ Quick stats calculated:', stats);
      return stats;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: !!user?.id
  });
};

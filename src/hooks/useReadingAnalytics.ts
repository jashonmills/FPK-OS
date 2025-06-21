
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  session_start: string;
  session_end: string | null;
  duration_seconds: number;
  pages_read: number;
  start_cfi: string | null;
  end_cfi: string | null;
  created_at: string;
}

export interface FavoriteBook {
  book_id: string;
  book_title: string;
  book_author: string;
  total_time: number;
  session_count: number;
}

export interface ReadingAnalytics {
  totalReadingTime: number;
  sessionsThisWeek: number;
  averageSessionLength: number;
  longestSession: number;
  favoriteBooks: FavoriteBook[];
  weeklyTrend: Array<{
    day: string;
    reading_time: number;
    sessions: number;
  }>;
  recentSessions: ReadingSession[];
}

export const useReadingAnalytics = () => {
  const { user } = useAuth();

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['reading-analytics', user?.id],
    queryFn: async (): Promise<ReadingAnalytics | null> => {
      if (!user?.id) {
        return null;
      }

      try {
        // Return empty analytics to prevent subscription issues
        return {
          totalReadingTime: 0,
          sessionsThisWeek: 0,
          averageSessionLength: 0,
          longestSession: 0,
          favoriteBooks: [],
          weeklyTrend: [],
          recentSessions: []
        };
      } catch (error) {
        console.error('📚 Error calculating reading analytics:', error);
        return {
          totalReadingTime: 0,
          sessionsThisWeek: 0,
          averageSessionLength: 0,
          longestSession: 0,
          favoriteBooks: [],
          weeklyTrend: [],
          recentSessions: []
        };
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on failure
  });

  return {
    analytics,
    isLoading,
    error
  };
};

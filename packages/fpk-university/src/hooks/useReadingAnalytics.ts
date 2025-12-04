
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ReadingSession {
  id: string;
  book_id: string;
  session_start: string;
  session_end: string | null;
  duration_seconds: number;
  pages_read: number;
  start_cfi: string | null;
  end_cfi: string | null;
}

export interface ReadingProgress {
  id: string;
  book_id: string;
  completion_percentage: number;
  current_cfi: string | null;
  reading_time_seconds: number;
  last_read_at: string;
}

export const useReadingAnalytics = (userId?: string) => {
  const { user } = useAuth();
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>([]);
  const [readingTrends, setReadingTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use provided userId or fall back to current user
  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) return;

    const fetchReadingAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch reading sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('reading_sessions')
          .select('*')
          .eq('user_id', targetUserId)
          .order('session_start', { ascending: false });

        if (sessionsError) throw sessionsError;

        // Fetch reading progress
        const { data: progressData, error: progressError } = await supabase
          .from('reading_progress')
          .select('*')
          .eq('user_id', targetUserId)
          .order('last_read_at', { ascending: false });

        if (progressError) throw progressError;

        setReadingSessions(sessionsData || []);
        setReadingProgress(progressData || []);
        
        // Process reading trends (simplified)
        const trends = (sessionsData || []).slice(0, 7).map((session, index) => ({
          day: new Date(session.session_start).toLocaleDateString(),
          readingTime: Math.round(session.duration_seconds / 60),
          pagesRead: session.pages_read
        }));
        
        setReadingTrends(trends);
        setError(null);
      } catch (err) {
        console.error('Error fetching reading analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch reading analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchReadingAnalytics();
  }, [targetUserId]);

  return {
    readingSessions,
    readingProgress,
    readingTrends,
    loading,
    error,
  };
};

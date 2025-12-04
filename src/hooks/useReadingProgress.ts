import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useXPIntegration } from '@/hooks/useXPIntegration';

interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_cfi: string | null;
  chapter_index: number;
  reading_time_seconds: number;
  completion_percentage: number;
  last_read_at: string;
  created_at: string;
  updated_at: string;
  progress: number; // Add this for compatibility
}

interface ReadingSession {
  id?: string;
  user_id: string;
  book_id: string;
  session_start: string;
  session_end?: string;
  duration_seconds: number;
  pages_read: number;
  start_cfi: string | null;
  end_cfi: string | null;
}

// Hook for specific book reading progress
export const useReadingProgress = (bookId: string) => {
  const { user } = useAuth();
  const { awardReadingSessionXP } = useXPIntegration();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null);
  const sessionStartTime = useRef<Date | null>(null);
  const lastCfi = useRef<string | null>(null);

  // Load existing progress
  const loadProgress = useCallback(async () => {
    if (!user?.id || !bookId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .maybeSingle();

      if (error) {
        console.error('Error loading reading progress:', error);
        return;
      }

      // Add progress property for compatibility
      if (data) {
        setProgress({
          ...data,
          progress: data.completion_percentage
        });
      }
    } catch (err) {
      console.error('Error in loadProgress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, bookId]);

  // Save or update progress
  const saveProgress = useCallback(async (
    cfi: string,
    chapterIndex: number = 0,
    completionPercentage: number = 0
  ) => {
    if (!user?.id || !bookId) return;

    const progressData = {
      user_id: user.id,
      book_id: bookId,
      current_cfi: cfi,
      chapter_index: chapterIndex,
      completion_percentage: Math.min(100, Math.max(0, completionPercentage)),
      last_read_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .upsert(progressData, {
          onConflict: 'user_id,book_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving reading progress:', error);
        return;
      }

      // Add progress property for compatibility
      setProgress({
        ...data,
        progress: data.completion_percentage
      });
      console.log('📖 Reading progress saved:', { cfi, chapterIndex, completionPercentage });
    } catch (err) {
      console.error('Error in saveProgress:', err);
    }
  }, [user?.id, bookId]);

  // Start reading session
  const startSession = useCallback((startCfi: string | null = null) => {
    if (!user?.id || !bookId) return;

    const now = new Date();
    sessionStartTime.current = now;
    lastCfi.current = startCfi;

    const session: ReadingSession = {
      user_id: user.id,
      book_id: bookId,
      session_start: now.toISOString(),
      duration_seconds: 0,
      pages_read: 0,
      start_cfi: startCfi,
      end_cfi: null,
    };

    setCurrentSession(session);
    console.log('📚 Reading session started');
  }, [user?.id, bookId]);

  // Enhanced endSession with XP integration
  const endSession = useCallback(async (endCfi: string | null = null) => {
    if (!currentSession || !sessionStartTime.current) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - sessionStartTime.current.getTime()) / 1000);

    // Only award XP for sessions longer than 30 seconds
    if (duration >= 30) {
      try {
        // Estimate pages read based on duration (rough estimate: 1 page per 2 minutes)
        const estimatedPages = Math.max(1, Math.floor(duration / 120));
        await awardReadingSessionXP(duration, estimatedPages);
        console.log('✅ Reading session XP awarded:', { duration, estimatedPages });
      } catch (xpError) {
        console.error('Error awarding reading session XP:', xpError);
        // Don't fail the session save if XP fails
      }
    }

    const sessionData = {
      ...currentSession,
      session_end: endTime.toISOString(),
      duration_seconds: duration,
      end_cfi: endCfi || lastCfi.current,
    };

    try {
      const { error } = await supabase
        .from('reading_sessions')
        .insert(sessionData);

      if (error) {
        console.error('Error saving reading session:', error);
        return;
      }

      // Update total reading time in progress
      if (progress) {
        const newReadingTime = progress.reading_time_seconds + duration;
        await supabase
          .from('reading_progress')
          .update({ reading_time_seconds: newReadingTime })
          .eq('user_id', user!.id)
          .eq('book_id', bookId);

        setProgress(prev => prev ? {
          ...prev,
          reading_time_seconds: newReadingTime
        } : null);
      }

      console.log('📚 Reading session ended:', { duration, endCfi });
    } catch (err) {
      console.error('Error in endSession:', err);
    } finally {
      setCurrentSession(null);
      sessionStartTime.current = null;
      lastCfi.current = null;
    }
  }, [currentSession, progress, user?.id, bookId, awardReadingSessionXP]);

  // Update current location during reading
  const updateLocation = useCallback((cfi: string, chapterIndex?: number) => {
    lastCfi.current = cfi;
    
    // Debounced save to avoid too frequent updates
    const timeoutId = setTimeout(() => {
      saveProgress(cfi, chapterIndex);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [saveProgress]);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Auto-end session on unmount
  useEffect(() => {
    return () => {
      if (currentSession) {
        endSession(lastCfi.current);
      }
    };
  }, [currentSession, endSession]);

  return {
    progress,
    isLoading,
    currentSession,
    loadProgress,
    saveProgress,
    startSession,
    endSession,
    updateLocation,
  };
};

// New hook for general reading progress (all books)
export const useGeneralReadingProgress = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ReadingProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: progressData, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_read_at', { ascending: false });

      if (error) {
        console.error('Error loading reading progress:', error);
        return;
      }

      // Add progress property for compatibility
      const formattedData = progressData?.map(item => ({
        ...item,
        progress: item.completion_percentage
      })) || [];

      setData(formattedData);
    } catch (err) {
      console.error('Error in loadProgress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    data,
    isLoading,
    refetch: loadProgress
  };
};

import { useCallback } from 'react';
import { ga4 } from '@/utils/ga4Setup';
import { useAuth } from '@/hooks/useAuth';

export const useLibraryAnalytics = () => {
  const { user } = useAuth();

  const trackBookOpened = useCallback((bookId: string, bookTitle: string, format: string) => {
    ga4.trackCustomEvent('book_opened', {
      user_id: user?.id,
      book_id: bookId,
      book_title: bookTitle,
      format: format,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackReadingSessionStarted = useCallback((bookId: string, chapter?: string) => {
    ga4.trackCustomEvent('reading_session_started', {
      user_id: user?.id,
      book_id: bookId,
      chapter: chapter,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackReadingSessionEnded = useCallback((bookId: string, duration: number, pagesRead: number) => {
    ga4.trackCustomEvent('reading_session_ended', {
      user_id: user?.id,
      book_id: bookId,
      duration_minutes: duration,
      pages_read: pagesRead,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackBookmarkAdded = useCallback((bookId: string, page: number) => {
    ga4.trackCustomEvent('bookmark_added', {
      user_id: user?.id,
      book_id: bookId,
      page_number: page,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackHighlightCreated = useCallback((bookId: string, highlightLength: number) => {
    ga4.trackCustomEvent('highlight_created', {
      user_id: user?.id,
      book_id: bookId,
      highlight_length: highlightLength,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackBookCompleted = useCallback((bookId: string, totalTime: number) => {
    ga4.trackCustomEvent('book_completed', {
      user_id: user?.id,
      book_id: bookId,
      total_time_minutes: totalTime,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackBookQuizStarted = useCallback((bookId: string) => {
    ga4.trackCustomEvent('book_quiz_started', {
      user_id: user?.id,
      book_id: bookId,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackBookQuizCompleted = useCallback((bookId: string, score: number, questionsAnswered: number) => {
    ga4.trackCustomEvent('book_quiz_completed', {
      user_id: user?.id,
      book_id: bookId,
      score: score,
      questions_answered: questionsAnswered,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  return {
    trackBookOpened,
    trackReadingSessionStarted,
    trackReadingSessionEnded,
    trackBookmarkAdded,
    trackHighlightCreated,
    trackBookCompleted,
    trackBookQuizStarted,
    trackBookQuizCompleted
  };
};

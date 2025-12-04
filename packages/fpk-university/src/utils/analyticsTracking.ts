import { supabase } from '@/integrations/supabase/client';
import { getActiveOrgId } from '@/lib/org/context';

export const trackKnowledgeBaseUsage = async (
  query: string, 
  resultCount: number, 
  sourceType: 'search' | 'chat' | 'browse',
  userId?: string
) => {
  if (!userId) return;

  try {
    await supabase
      .from('knowledge_base_usage')
      .insert({
        user_id: userId,
        query,
        result_count: resultCount,
        source_type: sourceType
      });
  } catch (error) {
    console.error('Error tracking knowledge base usage:', error);
  }
};

export const trackSearchAnalytics = async (
  query: string,
  category: string | null,
  resultCount: number,
  sourceType: 'library' | 'books' | 'courses' = 'library',
  userId?: string
) => {
  if (!userId) return;

  try {
    await supabase
      .from('search_analytics')
      .insert({
        user_id: userId,
        query,
        category,
        result_count: resultCount,
        source_type: sourceType
      });
  } catch (error) {
    console.error('Error tracking search analytics:', error);
  }
};

export const trackBookQuizSession = async (
  bookId: string,
  questionsAnswered: number,
  correctAnswers: number,
  sessionScore: number,
  xpAwarded: number,
  userId?: string
) => {
  if (!userId) return;

  try {
    await supabase
      .from('book_quiz_sessions')
      .insert({
        user_id: userId,
        book_id: bookId,
        questions_answered: questionsAnswered,
        correct_answers: correctAnswers,
        max_chapter_index: 1, // Default for now
        session_score: sessionScore,
        xp_awarded: xpAwarded
      });
    
    // Also track as search analytics for overall analytics
    await trackSearchAnalytics(
      `book-quiz-${bookId}`,
      'quiz-session',
      questionsAnswered,
      'books',
      userId
    );
  } catch (error) {
    console.error('Error tracking book quiz session:', error);
  }
};

export const trackDailyActivity = async (
  activityType: 'study' | 'reading' | 'chat' | 'notes' | 'goals' | 'quiz',
  durationMinutes: number = 0,
  userId?: string,
  orgId?: string
) => {
  if (!userId) return;

  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Upsert daily activity record
    await supabase
      .from('daily_activities')
      .upsert({
        user_id: userId,
        activity_date: today,
        activity_type: activityType,
        duration_minutes: durationMinutes,
        sessions_count: 1
      }, {
        onConflict: 'user_id,activity_date,activity_type'
      });
    
    // Also track in activity_log for organization analytics
    if (orgId) {
      await supabase
        .from('activity_log')
        .insert({
          user_id: userId,
          org_id: orgId,
          event: `${activityType}_activity`,
          metadata: {
            duration_minutes: durationMinutes,
            activity_date: today
          }
        });
    }
  } catch (error) {
    console.error('Error tracking daily activity:', error);
  }
};

export const trackOrgActivity = async (
  event: string,
  userId: string,
  orgId: string,
  metadata?: Record<string, any>
) => {
  if (!userId || !orgId) return;

  try {
    await supabase
      .from('activity_log')
      .insert({
        user_id: userId,
        org_id: orgId,
        event,
        metadata: metadata || {}
      });
  } catch (error) {
    console.error('Error tracking org activity:', error);
  }
};

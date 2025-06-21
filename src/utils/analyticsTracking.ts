
import { supabase } from '@/integrations/supabase/client';

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

export const trackDailyActivity = async (
  activityType: 'study' | 'reading' | 'chat' | 'notes' | 'goals',
  durationMinutes: number = 0,
  userId?: string
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
  } catch (error) {
    console.error('Error tracking daily activity:', error);
  }
};

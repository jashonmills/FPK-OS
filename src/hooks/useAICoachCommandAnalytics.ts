import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AICoachAnalyticsData {
  totalStudyTime: number;        // in hours
  sessionsCompleted: number;
  averageScore: number;
  streakDays: number;
  topicsStudied: string[];
}

export function useAICoachCommandAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AICoachAnalyticsData | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  const fetchAnalytics = async () => {
    if (!user?.id) {
      setIsLoadingAnalytics(false);
      return;
    }

    try {
      setIsLoadingAnalytics(true);

      // Fetch all analytics data in parallel
      const [timeResult, sessionsResult, scoreResult, streakResult, topicsResult] = await Promise.all([
        // Total study time
        supabase
          .from('ai_coach_analytics')
          .select('study_time_minutes')
          .eq('user_id', user.id),
        
        // Sessions completed (distinct session dates)
        supabase
          .from('ai_coach_analytics')
          .select('session_date')
          .eq('user_id', user.id),
        
        // Average comprehension score
        supabase
          .from('ai_coach_analytics')
          .select('comprehension_score')
          .eq('user_id', user.id)
          .not('comprehension_score', 'is', null),
        
        // Learning streak (using RPC function)
        supabase.rpc('get_ai_coach_learning_streak', { p_user_id: user.id }),
        
        // Topics studied
        supabase
          .from('ai_coach_analytics')
          .select('topics_explored')
          .eq('user_id', user.id)
      ]);

      // Calculate total study time in hours
      const totalMinutes = timeResult.data?.reduce((sum, record) => sum + (record.study_time_minutes || 0), 0) || 0;
      const totalStudyTime = Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal place

      // Count unique session dates
      const uniqueDates = new Set(sessionsResult.data?.map(record => record.session_date) || []);
      const sessionsCompleted = uniqueDates.size;

      // Calculate average comprehension score
      const scores = scoreResult.data?.map(record => record.comprehension_score).filter(Boolean) || [];
      const averageScore = scores.length > 0
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 0;

      // Get streak from RPC function
      const streakDays = streakResult.data || 0;

      // Extract unique topics
      const allTopics = new Set<string>();
      topicsResult.data?.forEach(record => {
        if (record.topics_explored && Array.isArray(record.topics_explored)) {
          record.topics_explored.forEach(topic => allTopics.add(topic));
        }
      });
      const topicsStudied = Array.from(allTopics);

      setAnalytics({
        totalStudyTime,
        sessionsCompleted,
        averageScore,
        streakDays,
        topicsStudied
      });
    } catch (error) {
      console.error('Error fetching AI coach analytics:', error);
      // Set default values on error
      setAnalytics({
        totalStudyTime: 0,
        sessionsCompleted: 0,
        averageScore: 0,
        streakDays: 0,
        topicsStudied: []
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const trackSession = async (
    studyTimeMinutes: number,
    topicsExplored: string[],
    comprehensionScore?: number
  ): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const sessionDate = new Date().toISOString().split('T')[0];

      // Upsert analytics record (accumulate for the day)
      const { error } = await supabase
        .from('ai_coach_analytics')
        .upsert({
          user_id: user.id,
          session_date: sessionDate,
          study_time_minutes: studyTimeMinutes,
          topics_explored: topicsExplored,
          comprehension_score: comprehensionScore,
          messages_sent: 1
        }, {
          onConflict: 'user_id,session_date',
          ignoreDuplicates: false
        });

      if (error) throw error;

      // Refresh analytics
      await fetchAnalytics();
      return true;
    } catch (error) {
      console.error('Error tracking session:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user?.id]);

  return {
    analytics,
    isLoadingAnalytics,
    trackSession,
    refetchAnalytics: fetchAnalytics
  };
}

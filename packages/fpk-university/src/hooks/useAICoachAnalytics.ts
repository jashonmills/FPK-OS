import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface AICoachMetrics {
  totalSessions: number;
  totalMessages: number;
  averageSessionDuration: number;
  averageMessagesPerSession: number;
  weeklySessionGrowth: number;
  sessionsThisWeek: number;
  weeklyActivity: Array<{ week: string; sessions: number; messages: number }>;
  contextTagDistribution: Record<string, number>;
}

export function useAICoachAnalytics(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  const [metrics, setMetrics] = useState<AICoachMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = async () => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch analytics data
      const { data: analyticsData, error: fetchError } = await supabase
        .from('ai_coach_analytics')
        .select('*')
        .eq('user_id', targetUserId);

      if (fetchError) throw fetchError;

      // Calculate metrics from data
      const totalSessions = analyticsData?.length || 0;
      const totalMessages = analyticsData?.reduce((sum, record) => sum + (record.messages_sent || 0), 0) || 0;
      const totalMinutes = analyticsData?.reduce((sum, record) => sum + (record.study_time_minutes || 0), 0) || 0;
      const averageSessionDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
      const averageMessagesPerSession = totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0;

      // Calculate sessions this week
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const sessionsThisWeek = analyticsData?.filter(record => {
        const sessionDate = new Date(record.session_date);
        return sessionDate >= oneWeekAgo;
      }).length || 0;

      // Calculate weekly growth (compare to previous week)
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const sessionsPreviousWeek = analyticsData?.filter(record => {
        const sessionDate = new Date(record.session_date);
        return sessionDate >= twoWeeksAgo && sessionDate < oneWeekAgo;
      }).length || 0;
      const weeklySessionGrowth = sessionsPreviousWeek > 0 
        ? Math.round(((sessionsThisWeek - sessionsPreviousWeek) / sessionsPreviousWeek) * 100)
        : 0;

      // Prepare weekly activity (last 4 weeks)
      const weeklyActivity = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const weekSessions = analyticsData?.filter(record => {
          const sessionDate = new Date(record.session_date);
          return sessionDate >= weekStart && sessionDate < weekEnd;
        }) || [];
        const weekMessages = weekSessions.reduce((sum, record) => sum + (record.messages_sent || 0), 0);
        
        weeklyActivity.push({
          week: `Week ${4 - i}`,
          sessions: weekSessions.length,
          messages: weekMessages
        });
      }

      // Calculate context tag distribution
      const contextTagDistribution: Record<string, number> = {};
      analyticsData?.forEach(record => {
        if (record.topics_explored && Array.isArray(record.topics_explored)) {
          record.topics_explored.forEach(topic => {
            contextTagDistribution[topic] = (contextTagDistribution[topic] || 0) + 1;
          });
        }
      });

      setMetrics({
        totalSessions,
        totalMessages,
        averageSessionDuration,
        averageMessagesPerSession,
        weeklySessionGrowth,
        sessionsThisWeek,
        weeklyActivity,
        contextTagDistribution
      });
    } catch (err) {
      console.error('Error fetching AI coach analytics:', err);
      setError(err as Error);
      // Set default values on error
      setMetrics({
        totalSessions: 0,
        totalMessages: 0,
        averageSessionDuration: 0,
        averageMessagesPerSession: 0,
        weeklySessionGrowth: 0,
        sessionsThisWeek: 0,
        weeklyActivity: [],
        contextTagDistribution: {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [targetUserId]);

  return {
    metrics,
    isLoading,
    error
  };
}

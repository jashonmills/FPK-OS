
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AICoachSession {
  id: string;
  title: string;
  context_tag: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  duration_minutes?: number;
}

interface AICoachMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AICoachMetrics {
  totalSessions: number;
  totalMessages: number;
  averageSessionDuration: number;
  averageMessagesPerSession: number;
  sessionsThisWeek: number;
  weeklySessionGrowth: number;
  contextTagDistribution: { [key: string]: number };
  weeklyActivity: Array<{
    week: string;
    sessions: number;
    messages: number;
  }>;
}

export const useAICoachAnalytics = () => {
  const [metrics, setMetrics] = useState<AICoachMetrics | null>(null);
  const [sessions, setSessions] = useState<AICoachSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadAICoachAnalytics = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all chat sessions for the user
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Fetch all messages for these sessions
      const sessionIds = sessionsData?.map(s => s.id) || [];
      let messagesData: AICoachMessage[] = [];
      
      if (sessionIds.length > 0) {
        const { data: messages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .in('session_id', sessionIds)
          .order('timestamp', { ascending: true });

        if (messagesError) throw messagesError;
        
        // Type cast the role field to ensure it matches our expected union type
        messagesData = (messages || []).map(msg => ({
          ...msg,
          role: msg.role as 'user' | 'assistant'
        }));
      }

      // Calculate session durations and message counts
      const enrichedSessions: AICoachSession[] = (sessionsData || []).map(session => {
        const sessionMessages = messagesData.filter(m => m.session_id === session.id);
        const messageCount = sessionMessages.length;
        
        let durationMinutes = 0;
        if (sessionMessages.length > 1) {
          const firstMessage = new Date(sessionMessages[0].timestamp);
          const lastMessage = new Date(sessionMessages[sessionMessages.length - 1].timestamp);
          durationMinutes = Math.round((lastMessage.getTime() - firstMessage.getTime()) / (1000 * 60));
        }

        return {
          ...session,
          message_count: messageCount,
          duration_minutes: Math.max(durationMinutes, 1) // Minimum 1 minute
        };
      });

      setSessions(enrichedSessions);

      // Calculate metrics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const totalSessions = enrichedSessions.length;
      const totalMessages = messagesData.length;
      const totalDuration = enrichedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      
      const sessionsThisWeek = enrichedSessions.filter(s => 
        new Date(s.created_at) >= oneWeekAgo
      ).length;
      
      const sessionsLastWeek = enrichedSessions.filter(s => {
        const createdAt = new Date(s.created_at);
        return createdAt >= twoWeeksAgo && createdAt < oneWeekAgo;
      }).length;

      const weeklySessionGrowth = sessionsLastWeek > 0 
        ? Math.round(((sessionsThisWeek - sessionsLastWeek) / sessionsLastWeek) * 100)
        : sessionsThisWeek > 0 ? 100 : 0;

      // Context tag distribution
      const contextTagDistribution: { [key: string]: number } = {};
      enrichedSessions.forEach(session => {
        const tag = session.context_tag || 'General Study Support';
        contextTagDistribution[tag] = (contextTagDistribution[tag] || 0) + 1;
      });

      // Weekly activity for the last 4 weeks
      const weeklyActivity = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        
        const weekSessions = enrichedSessions.filter(s => {
          const createdAt = new Date(s.created_at);
          return createdAt >= weekStart && createdAt < weekEnd;
        });

        const weekMessages = messagesData.filter(m => {
          const timestamp = new Date(m.timestamp);
          return timestamp >= weekStart && timestamp < weekEnd;
        });

        weeklyActivity.push({
          week: `Week ${4 - i}`,
          sessions: weekSessions.length,
          messages: weekMessages.length
        });
      }

      const calculatedMetrics: AICoachMetrics = {
        totalSessions,
        totalMessages,
        averageSessionDuration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
        averageMessagesPerSession: totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0,
        sessionsThisWeek,
        weeklySessionGrowth,
        contextTagDistribution,
        weeklyActivity
      };

      setMetrics(calculatedMetrics);

    } catch (error) {
      console.error('Error loading AI Coach analytics:', error);
      setError('Failed to load AI Coach analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAICoachAnalytics();
  }, [user]);

  return {
    metrics,
    sessions,
    isLoading,
    error,
    refetch: loadAICoachAnalytics
  };
};

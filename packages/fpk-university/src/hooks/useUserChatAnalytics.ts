import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserChatAnalytics {
  totalSessions: number;
  totalMessages: number;
  averageMessagesPerSession: number;
  recentSessions: Array<{
    id: string;
    title: string;
    messageCount: number;
    lastActivity: string;
    context: string;
  }>;
  topTopics: string[];
}

export const useUserChatAnalytics = (userId?: string) => {
  return useQuery({
    queryKey: ['user-chat-analytics', userId],
    queryFn: async (): Promise<UserChatAnalytics> => {
      if (!userId) throw new Error('User ID is required');

      // Get chat sessions
      const { data: chatSessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select(`
          id,
          title,
          context_tag,
          created_at,
          updated_at,
          topics
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Get message counts for each session
      const sessionIds = chatSessions?.map(s => s.id) || [];
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('session_id, content')
        .in('session_id', sessionIds)
        .eq('role', 'user'); // Only count user messages

      if (messagesError) throw messagesError;

      // Calculate message counts per session
      const messageCountBySession = messages?.reduce((acc, msg) => {
        acc[msg.session_id] = (acc[msg.session_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Calculate metrics
      const totalSessions = chatSessions?.length || 0;
      const totalMessages = messages?.length || 0;
      const averageMessagesPerSession = totalSessions > 0 
        ? Math.round(totalMessages / totalSessions) 
        : 0;

      // Extract topics
      const allTopics = chatSessions?.flatMap(session => 
        Array.isArray(session.topics) ? session.topics : []
      ) || [];
      
      const topicCounts = allTopics.reduce((acc, topic) => {
        if (typeof topic === 'string') {
          acc[topic] = (acc[topic] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topTopics = Object.entries(topicCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([topic]) => topic);

      // Format recent sessions
      const recentSessions = (chatSessions?.slice(0, 5) || []).map(session => ({
        id: session.id,
        title: session.title || 'Untitled Chat',
        messageCount: messageCountBySession[session.id] || 0,
        lastActivity: new Date(session.updated_at).toLocaleDateString(),
        context: session.context_tag || 'General'
      }));

      return {
        totalSessions,
        totalMessages,
        averageMessagesPerSession,
        recentSessions,
        topTopics
      };
    },
    enabled: !!userId
  });
};

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ChatTopicData {
  topic: string;
  count: number;
}

export const useChatTopics = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ChatTopicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchChatTopics = async () => {
      try {
        setLoading(true);
        
        const { data: sessions, error } = await supabase
          .from('chat_sessions')
          .select('topics')
          .eq('user_id', user.id)
          .not('topics', 'is', null);

        if (error) throw error;

        // Process topics from all sessions
        const topicCounts: { [key: string]: number } = {};
        
        sessions?.forEach(session => {
          if (session.topics && Array.isArray(session.topics)) {
            session.topics.forEach((topic: string) => {
              topicCounts[topic] = (topicCounts[topic] || 0) + 1;
            });
          }
        });

        // Convert to array and sort by count
        const topicsArray = Object.entries(topicCounts)
          .map(([topic, count]) => ({ topic, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Top 10 topics

        setData(topicsArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching chat topics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch chat topics');
      } finally {
        setLoading(false);
      }
    };

    fetchChatTopics();
  }, [user?.id]);

  return { data, loading, error };
};

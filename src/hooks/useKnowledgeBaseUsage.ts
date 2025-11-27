
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface KnowledgeBaseUsageData {
  id: string;
  query: string;
  result_count: number;
  source_type: 'search' | 'chat' | 'browse';
  created_at: string;
}

export const useKnowledgeBaseUsage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<KnowledgeBaseUsageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchKnowledgeBaseUsage = async () => {
      try {
        setLoading(true);
        
        const { data: usageData, error } = await supabase
          .from('knowledge_base_usage')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        // Type-safe mapping to ensure source_type matches our union type
        const typedData: KnowledgeBaseUsageData[] = (usageData || []).map(item => ({
          id: item.id,
          query: item.query,
          result_count: item.result_count,
          source_type: item.source_type as 'search' | 'chat' | 'browse',
          created_at: item.created_at
        }));

        setData(typedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching knowledge base usage:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch knowledge base usage');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBaseUsage();
  }, [user?.id]);

  const trackUsage = async (query: string, resultCount: number, sourceType: 'search' | 'chat' | 'browse') => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('knowledge_base_usage')
        .insert({
          user_id: user.id,
          query,
          result_count: resultCount,
          source_type: sourceType
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error tracking knowledge base usage:', err);
    }
  };

  return { data, loading, error, trackUsage };
};

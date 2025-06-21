
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RAGStats {
  totalEmbeddings: number;
  cacheEntries: number;
  lastProcessed: string | null;
}

export const useRAGIntegration = () => {
  const [stats, setStats] = useState<RAGStats>({
    totalEmbeddings: 0,
    cacheEntries: 0,
    lastProcessed: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadRAGStats = async () => {
    if (!user) return;

    try {
      const [embeddingsResult, cacheResult] = await Promise.all([
        supabase
          .from('knowledge_embeddings')
          .select('id, created_at', { count: 'exact' })
          .eq('user_id', user.id),
        supabase
          .from('knowledge_cache')
          .select('id', { count: 'exact' })
      ]);

      setStats({
        totalEmbeddings: embeddingsResult.count || 0,
        cacheEntries: cacheResult.count || 0,
        lastProcessed: embeddingsResult.data?.[0]?.created_at || null
      });
    } catch (error) {
      console.error('Error loading RAG stats:', error);
    }
  };

  const processUserContent = async (content: string, contentType: string) => {
    if (!user || !content.trim()) return;

    setIsProcessing(true);
    try {
      console.log('🔄 Processing content via edge function:', { contentType, userId: user.id });
      
      const { data, error } = await supabase.functions.invoke('process-user-content', {
        body: {
          content,
          contentType,
          userId: user.id
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw error;
      }

      console.log('✅ Content processed successfully:', data);

      toast({
        title: "Content Processed",
        description: `Your ${contentType} has been processed and added to your knowledge base.`,
      });

      await loadRAGStats();
    } catch (error) {
      console.error('Error processing content:', error);
      toast({
        title: "Processing Failed",
        description: `There was an error processing your ${contentType} for RAG.`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearRAGCache = async () => {
    try {
      await supabase
        .from('knowledge_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());

      toast({
        title: "Cache Cleared",
        description: "Expired RAG cache entries have been cleared.",
      });

      await loadRAGStats();
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({
        title: "Cache Clear Failed",
        description: "There was an error clearing the RAG cache.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadRAGStats();
  }, [user]);

  return {
    stats,
    isProcessing,
    processUserContent,
    clearRAGCache,
    refreshStats: loadRAGStats
  };
};

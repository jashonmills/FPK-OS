import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EmbeddingJob {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  total_documents: number;
  processed_documents: number;
  successful_embeddings: number;
  failed_embeddings: number;
  current_document_title: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export const useEmbeddingJobStatus = (enabled: boolean = false) => {
  const [currentJob, setCurrentJob] = useState<EmbeddingJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fetchLatestJob = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('kb_embedding_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setCurrentJob(data as EmbeddingJob);
        }
      } catch (error) {
        console.error('Error fetching embedding job:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchLatestJob();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('kb_embedding_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kb_embedding_jobs'
        },
        (payload) => {
          console.log('Embedding job update:', payload);
          fetchLatestJob(); // Refetch to get updated data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled]);

  return {
    currentJob,
    isLoading
  };
};

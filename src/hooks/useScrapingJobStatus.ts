import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ScrapingJob {
  id: string;
  job_type: string;
  source_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  documents_found: number | null;
  documents_added: number | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export const useScrapingJobStatus = (enabled: boolean = false) => {
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('kb_scraping_jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data) {
          setJobs(data as ScrapingJob[]);
        }
      } catch (error) {
        console.error('Error fetching scraping jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchJobs();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('kb_scraping_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kb_scraping_jobs'
        },
        (payload) => {
          console.log('Scraping job update:', payload);
          fetchJobs(); // Refetch to get updated data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled]);

  const getJobsByType = (jobType: string) => {
    return jobs.filter(job => job.job_type === jobType);
  };

  const getLatestJobByType = (jobType: string) => {
    return jobs.find(job => job.job_type === jobType);
  };

  return {
    jobs,
    isLoading,
    getJobsByType,
    getLatestJobByType
  };
};

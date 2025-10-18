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

    // Poll every 2 seconds while there are active jobs
    const interval = setInterval(() => {
      const hasActiveJobs = jobs.some(
        job => job.status === 'pending' || job.status === 'in_progress'
      );
      
      if (hasActiveJobs || jobs.length === 0) {
        fetchJobs();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [enabled, jobs.length]);

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

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ScormSummaryData {
  totalPackages: number;
  totalEnrollments: number;
  completed: number;
  avgScore: number;
  avgMinutes: number;
  packages: PackageMetric[];
}

export interface PackageMetric {
  package_id: string;
  title: string;
  package_status: string;
  created_at: string;
  enrollments: number;
  completions: number;
  completion_rate: number;
  avg_score: number;
  avg_minutes: number;
}

export interface LearnerProgress {
  enrollment_id: string;
  user_id: string;
  package_id: string;
  package_title: string;
  learner_name: string;
  sco_count: number;
  sco_completed: number;
  progress_pct: number;
  last_activity: string | null;
}

export function useScormSummary({ 
  days, 
  packageId 
}: { 
  days?: number; 
  packageId?: string 
} = {}) {
  return useQuery<ScormSummaryData>({
    queryKey: ['scorm-summary', days, packageId],
    queryFn: async () => {
      try {
        // Get total packages count
        const { count: totalPackages, error: packagesError } = await supabase
          .from('scorm_packages')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ready');

        if (packagesError) {
          console.error('Error fetching packages count:', packagesError);
        }

        // Get total enrollments count with date filter
        let enrollmentsQuery = supabase
          .from('scorm_enrollments')
          .select('*', { count: 'exact', head: true });
        
        if (days) {
          const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
          enrollmentsQuery = enrollmentsQuery.gte('enrolled_at', dateFrom);
        }

        const { count: totalEnrollments, error: enrollmentsError } = await enrollmentsQuery;
        
        if (enrollmentsError) {
          console.error('Error fetching enrollments count:', enrollmentsError);
        }

        // Get package metrics
        let metricsQuery = supabase.from('scorm_package_metrics').select('*');
        
        if (packageId) {
          metricsQuery = metricsQuery.eq('package_id', packageId);
        }

        const { data: packageMetrics, error: metricsError } = await metricsQuery;
        
        if (metricsError) {
          console.error('Error fetching package metrics:', metricsError);
        }

        // Calculate totals from package metrics
        const totals = (packageMetrics || []).reduce((acc, pkg) => {
          acc.completed += pkg.completions || 0;
          acc.scoreSum += (pkg.avg_score || 0);
          acc.pkgCount += pkg.avg_score ? 1 : 0; // Only count packages with scores
          acc.minSum += (pkg.avg_minutes || 0);
          acc.minCount += pkg.avg_minutes ? 1 : 0; // Only count packages with time data
          return acc;
        }, { 
          completed: 0, 
          scoreSum: 0, 
          pkgCount: 0, 
          minSum: 0, 
          minCount: 0 
        });

        return {
          totalPackages: totalPackages || 0,
          totalEnrollments: totalEnrollments || 0,
          completed: totals.completed,
          avgScore: totals.pkgCount > 0 ? Math.round(totals.scoreSum / totals.pkgCount) : 0,
          avgMinutes: totals.minCount > 0 ? Math.round(totals.minSum / totals.minCount) : 0,
          packages: packageMetrics || []
        };
      } catch (error) {
        console.error('Error in useScormSummary:', error);
        // Return zeros on error
        return {
          totalPackages: 0,
          totalEnrollments: 0,
          completed: 0,
          avgScore: 0,
          avgMinutes: 0,
          packages: []
        };
      }
    },
    staleTime: 30_000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });
}

export function useLearnerProgress({ 
  packageId,
  limit = 50,
  offset = 0
}: { 
  packageId?: string;
  limit?: number;
  offset?: number;
} = {}) {
  return useQuery<LearnerProgress[]>({
    queryKey: ['scorm-learner-progress', packageId, limit, offset],
    queryFn: async () => {
      try {
        let query = supabase
          .from('scorm_learner_progress')
          .select('*')
          .order('last_activity', { ascending: false, nullsFirst: false })
          .range(offset, offset + limit - 1);
        
        if (packageId) {
          query = query.eq('package_id', packageId);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching learner progress:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error in useLearnerProgress:', error);
        return [];
      }
    },
    staleTime: 60_000, // Cache for 1 minute
    refetchOnWindowFocus: false,
  });
}

export function useScormPackages({
  limit = 20,
  offset = 0,
  search = '',
  status = 'all'
}: {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
} = {}) {
  return useQuery({
    queryKey: ['scorm-packages', limit, offset, search, status],
    queryFn: async () => {
      try {
        let query = supabase
          .from('scorm_packages')
          .select('id, title, description, status, version, created_at, updated_at', { count: 'exact' })
          .order('created_at', { ascending: false });

        if (search) {
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        if (status !== 'all') {
          query = query.eq('status', status as any);
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        
        if (error) {
          console.error('Error fetching SCORM packages:', error);
          return { packages: [], total: 0 };
        }

        return { 
          packages: data || [], 
          total: count || 0 
        };
      } catch (error) {
        console.error('Error in useScormPackages:', error);
        return { packages: [], total: 0 };
      }
    },
    staleTime: 60_000, // Cache for 1 minute
    refetchOnWindowFocus: false,
  });
}

// Export function to download data as CSV
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
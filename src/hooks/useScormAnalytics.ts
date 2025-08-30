import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsFilters {
  packageId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

interface KPIs {
  totalPackages: number;
  activeEnrollments: number;
  avgScore: number;
  completionRate: number;
}

interface PackagePerformance {
  packageId: string;
  packageTitle: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  avgScore: number;
}

interface LearnerProgress {
  userId: string;
  packageId: string;
  packageTitle: string;
  learnerName: string;
  scosCompleted: number;
  scosTotal: number;
  progressPct: number;
  lastActivity: string | null;
}

interface TrendData {
  date: string;
  enrollments: number;
  activeLearners: number;
  avgScore: number;
  completionRate: number;
}

async function callAnalyticsFunction(type: string, filters: AnalyticsFilters) {
  const { data, error } = await supabase.functions.invoke('scorm-analytics', {
    body: {
      type,
      ...filters
    }
  });

  if (error) {
    throw new Error(error.message || 'Analytics request failed');
  }

  return data;
}

export function useScormKPIs(filters: AnalyticsFilters) {
  const { toast } = useToast();

  const query = useQuery<KPIs>({
    queryKey: ['scorm-kpis', filters.packageId, filters.dateFrom, filters.dateTo],
    queryFn: () => callAnalyticsFunction('kpis', filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle errors with useEffect
  React.useEffect(() => {
    if (query.error) {
      toast({
        title: "Failed to load KPIs",
        description: (query.error as any).message,
        variant: "destructive",
      });
    }
  }, [query.error, toast]);

  return query;
}

export function usePackagePerformance(filters: AnalyticsFilters) {
  const { toast } = useToast();

  const query = useQuery<PackagePerformance[]>({
    queryKey: ['package-performance', filters.packageId, filters.dateFrom, filters.dateTo],
    queryFn: () => callAnalyticsFunction('package-performance', filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  React.useEffect(() => {
    if (query.error) {
      toast({
        title: "Failed to load package performance",
        description: (query.error as any).message,
        variant: "destructive",
      });
    }
  }, [query.error, toast]);

  return query;
}

export function useLearnerProgress(filters: AnalyticsFilters) {
  const { toast } = useToast();

  const query = useQuery<{
    data: LearnerProgress[];
    total: number;
    page: number;
    pageSize: number;
  }>({
    queryKey: [
      'learner-progress', 
      filters.packageId, 
      filters.dateFrom, 
      filters.dateTo,
      filters.page,
      filters.pageSize,
      filters.search
    ],
    queryFn: () => callAnalyticsFunction('learner-progress', filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData,
  });

  React.useEffect(() => {
    if (query.error) {
      toast({
        title: "Failed to load learner progress",
        description: (query.error as any).message,
        variant: "destructive",
      });
    }
  }, [query.error, toast]);

  return query;
}

export function useScormTrends(filters: AnalyticsFilters) {
  const { toast } = useToast();

  const query = useQuery<TrendData[]>({
    queryKey: ['scorm-trends', filters.packageId, filters.dateFrom, filters.dateTo],
    queryFn: () => callAnalyticsFunction('trends', filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  React.useEffect(() => {
    if (query.error) {
      toast({
        title: "Failed to load trends",
        description: (query.error as any).message,
        variant: "destructive",
      });
    }
  }, [query.error, toast]);

  return query;
}

export function useScormPackagesList() {
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['scorm-packages-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scorm_packages')
        .select('id, title')
        .eq('status', 'ready')
        .order('title');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  React.useEffect(() => {
    if (query.error) {
      toast({
        title: "Failed to load packages",
        description: (query.error as any).message,
        variant: "destructive",
      });
    }
  }, [query.error, toast]);

  return query;
}

export async function exportAnalytics(
  view: 'packages' | 'learners' | 'trends',
  filters: AnalyticsFilters
) {
  const { data, error } = await supabase.functions.invoke('scorm-analytics-export', {
    body: {
      view,
      ...filters
    }
  });

  if (error) {
    throw new Error(error.message || 'Export failed');
  }

  // Create and trigger download
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `scorm-${view}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
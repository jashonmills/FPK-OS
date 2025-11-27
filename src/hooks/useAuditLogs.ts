import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuditLogEntry {
  id: string;
  created_at: string;
  user_id: string | null;
  actor_email: string | null;
  action_type: string;
  resource_id: string | null;
  target_user_id: string | null;
  status: string;
  details: any;
  resource_type: string;
}

interface UseAuditLogsFilters {
  search?: string;
  action?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface UseAuditLogsReturn {
  logs: AuditLogEntry[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setFilters: (filters: UseAuditLogsFilters) => void;
  refetch: () => void;
}

export function useAuditLogs(
  initialFilters: UseAuditLogsFilters = {},
  initialPageSize = 20
): UseAuditLogsReturn {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UseAuditLogsFilters>(initialFilters);
  const pageSize = initialPageSize;
  const { toast } = useToast();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query with filters
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply search filter
      if (filters.search) {
        query = query.or(
          `actor_email.ilike.%${filters.search}%,resource_id.ilike.%${filters.search}%,target_user_id.ilike.%${filters.search}%`
        );
      }

      // Apply action filter
      if (filters.action) {
        query = query.eq('action_type', filters.action);
      }

      // Apply status filter
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Apply date range filters
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(filters.dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query = query.lt('created_at', endDate.toISOString());
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audit logs';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const refetch = () => {
    fetchLogs();
  };

  return {
    logs,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    setPage,
    setFilters,
    refetch,
  };
}

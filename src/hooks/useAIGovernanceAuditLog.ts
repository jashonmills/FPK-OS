import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  id: string;
  action_type: string;
  resource_type: string;
  resource_id: string | null;
  user_id: string | null;
  actor_email: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  status: string | null;
}

export function useAIGovernanceAuditLog(orgId?: string | null) {
  const auditLogQuery = useQuery({
    queryKey: ['ai-governance-audit-log', orgId],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (orgId) {
        query = query.eq('organization_id', orgId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLogEntry[];
    },
  });

  return {
    auditLog: auditLogQuery.data ?? [],
    isLoading: auditLogQuery.isLoading,
    error: auditLogQuery.error,
  };
}

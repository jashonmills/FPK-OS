import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIGovernanceApproval {
  id: string;
  org_id: string | null;
  user_id: string;
  task: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  details: string | null;
  approved_by: string | null;
  requested_at: string;
  resolved_at: string | null;
  user_name?: string | null;
  user_email?: string | null;
}

export function useAIGovernanceApprovals(orgId?: string | null) {
  const queryClient = useQueryClient();

  const approvalsQuery = useQuery({
    queryKey: ['ai-governance-approvals', orgId],
    queryFn: async () => {
      let query = supabase
        .from('ai_governance_approvals')
        .select('*')
        .order('requested_at', { ascending: false });

      if (orgId) {
        query = query.eq('org_id', orgId);
      }

      const { data: approvals, error } = await query;
      if (error) throw error;

      // Fetch user profiles separately
      const userIds = [...new Set(approvals?.map(a => a.user_id) ?? [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) ?? []);

      return approvals?.map(approval => ({
        ...approval,
        priority: approval.priority as 'high' | 'medium' | 'low',
        status: approval.status as 'pending' | 'approved' | 'rejected',
        user_name: profileMap.get(approval.user_id)?.full_name ?? null,
        user_email: profileMap.get(approval.user_id)?.email ?? null,
      })) as AIGovernanceApproval[];
    },
  });

  const pendingApprovals = approvalsQuery.data?.filter(a => a.status === 'pending') ?? [];

  const approveRequest = useMutation({
    mutationFn: async ({ id, approvedBy }: { id: string; approvedBy: string }) => {
      const { data, error } = await supabase
        .from('ai_governance_approvals')
        .update({
          status: 'approved',
          approved_by: approvedBy,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-approvals'] });
      toast.success('Request approved');
    },
    onError: (error) => {
      toast.error('Failed to approve: ' + error.message);
    },
  });

  const rejectRequest = useMutation({
    mutationFn: async ({ id, approvedBy }: { id: string; approvedBy: string }) => {
      const { data, error } = await supabase
        .from('ai_governance_approvals')
        .update({
          status: 'rejected',
          approved_by: approvedBy,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-approvals'] });
      toast.success('Request rejected');
    },
    onError: (error) => {
      toast.error('Failed to reject: ' + error.message);
    },
  });

  const createRequest = useMutation({
    mutationFn: async (request: { user_id: string; task: string; category: string; priority?: string; details?: string; org_id?: string | null }) => {
      const { data, error } = await supabase
        .from('ai_governance_approvals')
        .insert(request)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-governance-approvals'] });
      toast.success('Request submitted');
    },
    onError: (error) => {
      toast.error('Failed to submit request: ' + error.message);
    },
  });

  return {
    approvals: approvalsQuery.data ?? [],
    pendingApprovals,
    isLoading: approvalsQuery.isLoading,
    error: approvalsQuery.error,
    approveRequest,
    rejectRequest,
    createRequest,
  };
}

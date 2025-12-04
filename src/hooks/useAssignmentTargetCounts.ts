import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { assertOrg } from '@/lib/org/context';

export interface AssignmentTargetCount {
  assignment_id: string;
  total_targets: number;
  pending_count: number;
  started_count: number;
  completed_count: number;
}

export function useAssignmentTargetCounts() {
  const orgId = assertOrg();

  const { data: targetCounts = [], isLoading, error } = useQuery({
    queryKey: ['assignment-target-counts', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_assignment_targets')
        .select(`
          assignment_id,
          status
        `)
        .eq('target_type', 'user');

      if (error) {
        console.error('Error fetching assignment target counts:', error);
        throw error;
      }

      // Group by assignment and calculate counts
      const counts = (data as any[]).reduce((acc, target) => {
        const assignmentId = target.assignment_id;
        if (!acc[assignmentId]) {
          acc[assignmentId] = {
            assignment_id: assignmentId,
            total_targets: 0,
            pending_count: 0,
            started_count: 0,
            completed_count: 0,
          };
        }

        acc[assignmentId].total_targets++;
        
        const status = target.status || 'pending';
        switch (status) {
          case 'pending':
            acc[assignmentId].pending_count++;
            break;
          case 'started':
            acc[assignmentId].started_count++;
            break;
          case 'completed':
            acc[assignmentId].completed_count++;
            break;
        }

        return acc;
      }, {} as Record<string, AssignmentTargetCount>);

      return Object.values(counts);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const getCountsForAssignment = (assignmentId: string): AssignmentTargetCount => {
    const found = (targetCounts as AssignmentTargetCount[]).find(count => count.assignment_id === assignmentId);
    return found || {
      assignment_id: assignmentId,
      total_targets: 0,
      pending_count: 0,
      started_count: 0,
      completed_count: 0,
    };
  };

  return {
    targetCounts,
    getCountsForAssignment,
    isLoading,
    error,
  };
}
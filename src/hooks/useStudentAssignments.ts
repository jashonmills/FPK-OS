import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { CourseCard } from '@/types/course-card';

export interface StudentAssignment {
  id: string;
  assignment_id: string;
  title: string;
  type: string;
  resource_id: string;
  created_at: string;
  org_id: string;
  metadata?: any;
  target: {
    assignment_id: string;
    target_id: string;
    target_type: string;
    status?: 'pending' | 'started' | 'completed';
    assigned_at: string;
    started_at?: string;
    completed_at?: string;
    due_at?: string;
  };
  course?: CourseCard;
}

export function useStudentAssignments(orgId?: string) {
  const { user } = useAuth();

  const { data: assignments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['student-assignments', user?.id, orgId],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('org_assignment_targets')
        .select(`
          assignment_id,
          target_id,
          target_type,
          status,
          assigned_at,
          started_at,
          completed_at,
          due_at,
          org_assignments!inner (
            id,
            title,
            type,
            resource_id,
            org_id,
            created_at,
            metadata
          )
        `)
        .eq('target_id', user.id)
        .eq('target_type', 'user');

      if (orgId) {
        query = query.eq('org_assignments.org_id', orgId);
      }

      const { data, error } = await query.order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error fetching student assignments:', error);
        throw error;
      }

      // Transform the data to match our interface - using explicit typing for new columns
      return (data as any[]).map((item: any) => ({
        id: item.org_assignments.id,
        assignment_id: item.assignment_id,
        title: item.org_assignments.title,
        type: item.org_assignments.type,
        resource_id: item.org_assignments.resource_id,
        created_at: item.org_assignments.created_at,
        org_id: item.org_assignments.org_id,
        metadata: item.org_assignments.metadata,
        target: {
          assignment_id: item.assignment_id,
          target_id: item.target_id,
          target_type: item.target_type,
          status: item.status || 'pending',
          assigned_at: item.assigned_at,
          started_at: item.started_at,
          completed_at: item.completed_at,
          due_at: item.due_at,
        }
      })) as StudentAssignment[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    assignments,
    isLoading,
    error,
    refetch,
  };
}
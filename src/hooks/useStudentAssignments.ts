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
  groupName?: string; // Name of the group if assigned via group
}

export function useStudentAssignments(orgId?: string) {
  const { user } = useAuth();

  const { data: assignments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['student-assignments', user?.id, orgId],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get direct assignments and group assignments
      const directAssignmentsQuery = supabase
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
            created_at
          )
        `)
        .eq('target_id', user.id)
        .eq('target_type', 'member');

      // First fetch the group IDs the user is a member of
      const { data: groupMemberships, error: groupMembershipsError } = await supabase
        .from('org_group_members')
        .select('group_id')
        .eq('user_id', user.id);

      if (groupMembershipsError) {
        console.error('Error fetching group memberships:', groupMembershipsError);
        throw groupMembershipsError;
      }

      const groupIds: string[] = groupMemberships?.map(m => m.group_id) || [];

      // Build group assignments query (without org_groups join)
      let groupAssignmentsQuery = supabase
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
            created_at
          )
        `)
        .eq('target_type', 'group');

      // Only add .in() filter if there are group IDs
      if (groupIds.length > 0) {
        groupAssignmentsQuery = groupAssignmentsQuery.in('target_id', groupIds);
      }

      let query = directAssignmentsQuery;

      if (orgId) {
        directAssignmentsQuery.eq('org_assignments.org_id', orgId);
        groupAssignmentsQuery.eq('org_assignments.org_id', orgId);
      }

      const [directResult, groupResult] = await Promise.all([
        directAssignmentsQuery.order('assigned_at', { ascending: false }),
        groupAssignmentsQuery.order('assigned_at', { ascending: false })
      ]);

      if (directResult.error) {
        console.error('Error fetching direct assignments:', directResult.error);
        throw directResult.error;
      }

      if (groupResult.error) {
        console.error('Error fetching group assignments:', groupResult.error);
        throw groupResult.error;
      }

      const directData = directResult.data || [];
      const groupData = groupResult.data || [];

      // Fetch group names for group assignments
      const groupTargetIds = groupData.map((item: any) => item.target_id);
      let groupNames: Record<string, string> = {};
      
      if (groupTargetIds.length > 0) {
        const { data: groups } = await supabase
          .from('org_groups')
          .select('id, name')
          .in('id', groupTargetIds);
        
        if (groups) {
          groupNames = groups.reduce((acc, group) => {
            acc[group.id] = group.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      // Transform and combine both direct and group assignments
      const allAssignments = [
        ...(directData as any[]).map((item: any) => ({
        id: item.org_assignments.id,
        assignment_id: item.assignment_id,
        title: item.org_assignments.title,
        type: item.org_assignments.type,
        resource_id: item.org_assignments.resource_id,
        created_at: item.org_assignments.created_at,
        org_id: item.org_assignments.org_id,
        target: {
          assignment_id: item.assignment_id,
          target_id: item.target_id,
          target_type: item.target_type,
          status: item.status || 'pending',
          assigned_at: item.assigned_at,
          started_at: item.started_at,
          completed_at: item.completed_at,
          due_at: item.due_at,
        },
        groupName: undefined
      })),
        ...(groupData as any[]).map((item: any) => ({
        id: item.org_assignments.id,
        assignment_id: item.assignment_id,
        title: item.org_assignments.title,
        type: item.org_assignments.type,
        resource_id: item.org_assignments.resource_id,
        created_at: item.org_assignments.created_at,
        org_id: item.org_assignments.org_id,
        target: {
          assignment_id: item.assignment_id,
          target_id: item.target_id,
          target_type: item.target_type,
          status: item.status || 'pending',
          assigned_at: item.assigned_at,
          started_at: item.started_at,
          completed_at: item.completed_at,
          due_at: item.due_at,
        },
        groupName: groupNames[item.target_id]
      }))
      ] as StudentAssignment[];

      // Remove duplicates (if user is assigned both directly and via group)
      const uniqueAssignments = allAssignments.filter((assignment, index, self) =>
        index === self.findIndex((a) => a.id === assignment.id)
      );

      return uniqueAssignments;
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
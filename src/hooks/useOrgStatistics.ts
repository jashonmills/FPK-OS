import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgContext } from '@/components/organizations/OrgContext';

export interface OrgStatistics {
  totalMembers: number;
  activeMembers: number;
  studentCount: number;
  instructorCount: number;
  courseAssignments: number;
  activeGoals: number;
  completedGoals: number;
  totalNotes: number;
  completionRate: number;
}

export function useOrgStatistics() {
  const { currentOrg } = useOrgContext();
  
  return useQuery({
    queryKey: ['org-statistics', currentOrg?.organization_id],
    queryFn: async (): Promise<OrgStatistics> => {
      if (!currentOrg?.organization_id) {
        throw new Error('No organization selected');
      }

      const orgId = currentOrg.organization_id;

      // Get member counts
      const { data: members, error: membersError } = await supabase
        .from('org_members')
        .select('role, status')
        .eq('org_id', orgId);

      if (membersError) throw membersError;

      const totalMembers = members?.length || 0;
      const activeMembers = members?.filter(m => m.status === 'active').length || 0;
      const studentCount = members?.filter(m => m.role === 'student' && m.status === 'active').length || 0;
      const instructorCount = members?.filter(m => m.role === 'instructor' && m.status === 'active').length || 0;

      // Get course assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('org_course_assignments')
        .select('id')
        .eq('organization_id', orgId);

      if (assignmentsError) throw assignmentsError;
      const courseAssignments = assignments?.length || 0;

      // Get goals
      const { data: goals, error: goalsError } = await supabase
        .from('org_goals')
        .select('status')
        .eq('organization_id', orgId);

      if (goalsError) throw goalsError;
      const activeGoals = goals?.filter(g => g.status === 'active').length || 0;
      const completedGoals = goals?.filter(g => g.status === 'completed').length || 0;

      // Get notes
      const { data: notes, error: notesError } = await supabase
        .from('org_notes')
        .select('id')
        .eq('organization_id', orgId);

      if (notesError) throw notesError;
      const totalNotes = notes?.length || 0;

      // Calculate completion rate
      const totalGoals = activeGoals + completedGoals;
      const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

      return {
        totalMembers,
        activeMembers,
        studentCount,
        instructorCount,
        courseAssignments,
        activeGoals,
        completedGoals,
        totalNotes,
        completionRate
      };
    },
    enabled: !!currentOrg?.organization_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
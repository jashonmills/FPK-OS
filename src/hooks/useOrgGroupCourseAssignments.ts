import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GroupCourseAssignment {
  id: string;
  group_id: string;
  course_id: string;
  assigned_at: string;
  assigned_by: string;
}

export function useOrgGroupCourseAssignments(groupId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch courses assigned to a specific group
  const { data: groupCourses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-group-course-assignments', groupId],
    queryFn: async () => {
      if (!groupId) throw new Error('Group ID required');

      const { data, error } = await supabase
        .from('org_group_course_assignments')
        .select('*')
        .eq('group_id', groupId)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      return data as GroupCourseAssignment[];
    },
    enabled: !!groupId,
  });

  // Assign course to group
  const assignCourseToGroupMutation = useMutation({
    mutationFn: async ({ groupId, courseId }: { groupId: string; courseId: string }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('org_group_course_assignments')
        .insert({
          group_id: groupId,
          course_id: courseId,
          assigned_by: user.data.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-group-course-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['student-course-assignments'] });
      toast({
        title: 'Course Assigned to Group',
        description: 'All group members have been assigned this course.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Assignment Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Unassign course from group
  const unassignCourseFromGroupMutation = useMutation({
    mutationFn: async ({ groupId, courseId }: { groupId: string; courseId: string }) => {
      const { error } = await supabase
        .from('org_group_course_assignments')
        .delete()
        .eq('group_id', groupId)
        .eq('course_id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-group-course-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['student-course-assignments'] });
      toast({
        title: 'Course Unassigned from Group',
        description: 'The course has been removed from all group members.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Unassignment Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get all groups a course is assigned to
  const { data: courseGroups = [] } = useQuery({
    queryKey: ['course-group-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_group_course_assignments')
        .select(`
          *,
          group:org_groups(
            id,
            name,
            description
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  return {
    groupCourses,
    isLoading,
    error,
    refetch,
    assignCourseToGroup: assignCourseToGroupMutation.mutate,
    unassignCourseFromGroup: unassignCourseFromGroupMutation.mutate,
    isAssigning: assignCourseToGroupMutation.isPending,
    isUnassigning: unassignCourseFromGroupMutation.isPending,
    courseGroups,
  };
}

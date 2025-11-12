import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrganizationCourseAssignment {
  id: string;
  organization_id: string;
  course_id: string;
  assigned_at: string;
  assigned_by: string;
  course?: {
    id: string;
    title: string;
    description?: string;
    enrollments?: number;
    completion_rate?: number;
  };
}

export function useOrganizationCourseAssignments(organizationId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch assigned courses for the organization
  const { data: assignedCourses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['organization-course-assignments', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        throw new Error('No organization ID provided');
      }

      const { data, error } = await supabase
        .from('organization_course_assignments')
        .select(`
          *,
          course:courses(
            id,
            title,
            description
          )
        `)
        .eq('organization_id', organizationId)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      
      return data as OrganizationCourseAssignment[];
    },
    enabled: !!organizationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Assign course to organization
  const assignCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!organizationId) {
        throw new Error('No organization ID available');
      }

      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('organization_course_assignments')
        .insert({
          organization_id: organizationId,
          course_id: courseId,
          assigned_by: user.data.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, courseId };
    },
    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ['organization-course-assignments', organizationId] });
      
      // Send notifications to all students
      const { triggerCourseAssignmentNotification } = await import('@/utils/notificationTriggers');
      
      // Get course title
      const { data: courseData } = await supabase
        .from('courses')
        .select('title')
        .eq('id', result.courseId)
        .single();
      
      // Get all students in the organization
      const { data: members } = await supabase
        .from('org_members')
        .select('user_id')
        .eq('org_id', organizationId)
        .eq('role', 'student')
        .eq('status', 'active');
      
      if (members && courseData && members.length > 0) {
        await triggerCourseAssignmentNotification(
          members.map(m => m.user_id),
          result.courseId,
          courseData.title,
          organizationId!
        );
      }
      
      toast({
        title: "Course Assigned",
        description: "Course has been successfully assigned to your organization.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Assignment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Unassign course from organization
  const unassignCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!organizationId) {
        throw new Error('No organization ID available');
      }

      const { error } = await supabase
        .from('organization_course_assignments')
        .delete()
        .eq('organization_id', organizationId)
        .eq('course_id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-course-assignments', organizationId] });
      toast({
        title: "Course Unassigned",
        description: "Course has been successfully removed from your organization.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Unassignment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if a course is assigned to the organization
  const isCourseAssigned = (courseId: string) => {
    return assignedCourses.some(assignment => assignment.course_id === courseId);
  };

  return {
    assignedCourses,
    isLoading,
    error,
    refetch,
    assignCourse: assignCourseMutation.mutate,
    unassignCourse: unassignCourseMutation.mutate,
    isAssigning: assignCourseMutation.isPending,
    isUnassigning: unassignCourseMutation.isPending,
    isCourseAssigned,
  };
}
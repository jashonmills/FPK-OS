import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentCourseAssignment {
  id: string;
  student_id: string;
  course_id: string;
  org_id: string;
  assigned_by: string;
  assigned_at: string;
  due_date?: string;
  status: 'active' | 'completed' | 'dropped' | 'paused';
  progress_percentage: number;
  last_accessed_at?: string;
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseAssignmentData {
  student_id: string;
  course_id: string;
  org_id: string;
  due_date?: string;
  notes?: string;
}

export function useStudentCourseAssignments(studentId?: string, orgId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch course assignments
  const { data: assignments = [], isLoading, error, refetch } = useQuery({
    queryKey: ['student-course-assignments', studentId, orgId],
    queryFn: async () => {
      let query = supabase.from('student_course_assignments').select('*');
      
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      if (orgId) {
        query = query.eq('org_id', orgId);
      }
      
      const { data, error } = await query.order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data as StudentCourseAssignment[];
    },
    enabled: !!(studentId || orgId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Assign course mutation
  const assignCourseMutation = useMutation({
    mutationFn: async (assignmentData: CreateCourseAssignmentData) => {
      const { data, error } = await supabase
        .from('student_course_assignments')
        .insert({
          ...assignmentData,
          assigned_by: (await supabase.auth.getUser()).data.user?.id!,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-assignments'] });
      toast({
        title: "Course Assigned",
        description: "The course has been successfully assigned to the student.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign course to student.",
        variant: "destructive",
      });
    },
  });

  // Update assignment mutation
  const updateAssignmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StudentCourseAssignment> }) => {
      const { data, error } = await supabase
        .from('student_course_assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-assignments'] });
      toast({
        title: "Assignment Updated",
        description: "The course assignment has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update course assignment.",
        variant: "destructive",
      });
    },
  });

  // Remove assignment mutation
  const removeAssignmentMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('student_course_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-assignments'] });
      toast({
        title: "Course Removed",
        description: "The course has been removed from the student.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove course assignment.",
        variant: "destructive",
      });
    },
  });

  return {
    assignments,
    isLoading,
    error,
    refetch,
    assignCourse: assignCourseMutation.mutate,
    updateAssignment: updateAssignmentMutation.mutate,
    removeAssignment: removeAssignmentMutation.mutate,
    isAssigning: assignCourseMutation.isPending,
    isUpdating: updateAssignmentMutation.isPending,
    isRemoving: removeAssignmentMutation.isPending,
  };
}
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseDuplication {
  id: string;
  original_course_id: string;
  duplicated_course_id: string;
  duplicated_by: string;
  org_id?: string;
  attribution_info: Record<string, any>;
  created_at: string;
}

export function useCourseDuplication(orgId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const duplicateCourse = useMutation({
    mutationFn: async ({ courseId, title, attribution }: { 
      courseId: string; 
      title?: string;
      attribution?: Record<string, any>;
    }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Generate a new course ID for the duplicate
      const timestamp = Date.now();
      const duplicatedCourseId = `${courseId}-copy-${timestamp}`;

      // Record the duplication in our tracking table
      const { data, error } = await supabase
        .from('course_duplicates')
        .insert({
          original_course_id: courseId,
          duplicated_course_id: duplicatedCourseId,
          duplicated_by: user.data.user.id,
          org_id: orgId,
          attribution_info: {
            original_title: title,
            duplicated_at: new Date().toISOString(),
            ...attribution
          }
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // In a real implementation, you would also:
      // 1. Copy course data to org_courses table
      // 2. Copy associated lessons, assessments, etc.
      // 3. Update course metadata with attribution
      
      return { 
        duplication: data, 
        duplicatedCourseId,
        editUrl: `/org/${orgId}/courses/edit/${duplicatedCourseId}?cloned=true`
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-duplicates'] });
      
      toast({
        title: "Course Duplicated",
        description: "Course has been cloned to your organization with proper attribution.",
      });
      
      // Navigate to the edit page for the duplicated course
      if (result.editUrl) {
        window.open(result.editUrl, '_blank');
      }
    },
    onError: (error) => {
      console.error('Duplication error:', error);
      toast({
        title: "Duplication Failed",
        description: "Failed to duplicate course. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    duplicateCourse,
    isLoading: duplicateCourse.isPending,
  };
}
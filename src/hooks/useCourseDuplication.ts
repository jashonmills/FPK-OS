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

      // First get the original course data
      const { data: originalCourse, error: fetchError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (fetchError) throw fetchError;

      // Create the duplicated course entry
      const { data: newCourse, error: courseError } = await supabase
        .from('courses')
        .insert({
          id: duplicatedCourseId,
          title: `${originalCourse.title} (Copy)`,
          description: originalCourse.description,
          instructor_name: originalCourse.instructor_name,
          duration_minutes: originalCourse.duration_minutes,
          difficulty_level: originalCourse.difficulty_level,
          tags: originalCourse.tags,
          thumbnail_url: originalCourse.thumbnail_url,
          status: 'draft', // Start as draft for organization
          source: 'duplicated',
          org_id: orgId,
          organization_id: orgId,
          created_by: user.data.user.id,
          course_visibility: 'organization_only'
        })
        .select()
        .single();

      if (courseError) throw courseError;

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
        // Navigate back to courses catalog instead of non-existent edit page
        catalogUrl: `/org/${orgId}/courses`
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-duplicates'] });
      
      const attributionInfo = result.duplication.attribution_info as any;
      toast({
        title: "Course Cloned Successfully",
        description: `"${attributionInfo?.original_title || 'Course'} (Copy)" has been added to your organization.`,
      });
      
      // Refresh the page to show the new course
      window.location.reload();
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
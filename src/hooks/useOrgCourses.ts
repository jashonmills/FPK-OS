import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assertOrg } from '@/lib/org/context';

export interface OrgCourse {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  level?: string;
  published: boolean;
  deleted_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  enrollments_count?: number;
  completion_rate?: number;
  thumbnail_url?: string;
  duration_minutes?: number;
  status?: string;
}

export function useOrgCourses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = assertOrg();

  const { data: courses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-courses', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_courses')
        .select('*')
        .eq('org_id', orgId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching org courses:', error);
        throw error;
      }

      return data as OrgCourse[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: Omit<OrgCourse, 'id' | 'created_at' | 'updated_at' | 'org_id' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('org_courses')
        .insert({
          ...courseData,
          org_id: orgId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-courses'] });
      toast({
        title: "Success",
        description: "Course created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course.",
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: async (courseData: Partial<OrgCourse> & { id: string }) => {
      const { id, ...updateData } = courseData;
      const { data, error } = await supabase
        .from('org_courses')
        .update(updateData)
        .eq('id', id)
        .eq('org_id', orgId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-courses'] });
      toast({
        title: "Success",
        description: "Course updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Failed to update course.",
        variant: "destructive",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('org_courses')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', courseId)
        .eq('org_id', orgId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-courses'] });
      toast({
        title: "Success",
        description: "Course deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ courseId, published }: { courseId: string; published: boolean }) => {
      const { error } = await supabase
        .from('org_courses')
        .update({ published })
        .eq('id', courseId)
        .eq('org_id', orgId);

      if (error) throw error;
    },
    onSuccess: (_, { published }) => {
      queryClient.invalidateQueries({ queryKey: ['org-courses'] });
      toast({
        title: "Success",
        description: `Course ${published ? 'published' : 'unpublished'} successfully.`,
      });
    },
    onError: (error) => {
      console.error('Error toggling course publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update course status.",
        variant: "destructive",
      });
    },
  });

  return {
    courses,
    isLoading,
    error,
    refetch,
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    togglePublish: togglePublishMutation.mutate,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,
    isTogglingPublish: togglePublishMutation.isPending,
  };
}
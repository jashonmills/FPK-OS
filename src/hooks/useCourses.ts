
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  title: string;
  description?: string;
  slug?: string;
  status?: string;
  instructor_name?: string;
  duration_minutes?: number;
  difficulty_level?: string;
  tags?: string[];
  thumbnail_url?: string;
  price?: number;
  is_free?: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useCourses(options?: { 
  featured?: boolean; 
  status?: string;
  limit?: number;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['courses', options],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      return data as Course[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
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
    mutationFn: async (courseData: Partial<Course> & { id: string }) => {
      const { id, ...updateData } = courseData;
      const { data, error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
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
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
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

  return {
    courses,
    isLoading,
    error,
    refetch,
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,
  };
}

export function useCourse(slugOrId: string) {
  const { data: course, isLoading, error, refetch } = useQuery({
    queryKey: ['course', slugOrId],
    queryFn: async () => {
      if (!slugOrId) return null;

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(`id.eq.${slugOrId},slug.eq.${slugOrId}`)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        throw error;
      }

      return data as Course;
    },
    enabled: !!slugOrId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    course,
    isLoading,
    error,
    refetch
  };
}

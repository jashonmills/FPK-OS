import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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
  organization_id?: string;
  course_visibility?: 'global' | 'organization_only' | 'private';
  enrollments_count?: number;
  completion_rate?: number;
  // Project Phoenix: Essential fields for routing and rendering
  framework_type?: string;
  content_version?: string;
  content_component?: string;
}

// Type for creating a new course (without id, created_at, updated_at)
type CreateCourseData = Omit<Course, 'id' | 'created_at' | 'updated_at'>;

export function useCourses(options?: { 
  featured?: boolean; 
  status?: string;
  limit?: number;
  organizationId?: string;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['courses-v2', options], // v2 to force cache invalidation
    queryFn: async () => {
      console.log('[useCourses] Query options:', options);
      
      // Use RPC function for published courses to bypass RLS issues
      if (options?.status === 'published' && !options?.organizationId) {
        console.log('[useCourses] Using RPC get_published_courses');
        const { data, error } = await supabase.rpc('get_published_courses');
        
        if (error) {
          console.error('[useCourses] RPC error:', error);
          throw error;
        }

        console.log('[useCourses] RPC returned', data?.length, 'courses');
        let filteredData = data as Course[];

        // Apply client-side filtering for featured and limit
        if (options?.featured === true) {
          filteredData = filteredData.filter(c => c.featured === true);
          console.log('[useCourses] After featured filter:', filteredData.length);
        }

        if (options?.limit) {
          filteredData = filteredData.slice(0, options.limit);
          console.log('[useCourses] After limit filter:', filteredData.length);
        }

        console.log('[useCourses] Returning courses:', filteredData.map(c => c.slug));
        return filteredData;
      }

      // Fallback to direct query for other cases
      console.log('[useCourses] Using direct table query (fallback)');
      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.featured === true) {
        query = query.eq('featured', true);
      }

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      // Filter by organization if specified
      if (options?.organizationId) {
        query = query.or(`organization_id.eq.${options.organizationId},course_visibility.eq.global`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }

      console.log('[useCourses] Direct query returned', data?.length, 'courses');
      return data as Course[];
    },
    staleTime: 0, // Disable caching to force fresh fetch
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: CreateCourseData) => {
      // Generate a new id so the Insert type matches
      const newCourse = { ...courseData, id: uuidv4() };

      const { data, error } = await supabase
        .from('courses')
        .insert(newCourse)
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
    queryKey: ['course-v2', slugOrId], // v2 to force cache invalidation
    queryFn: async () => {
      if (!slugOrId) return null;

      console.log('[useCourse] Fetching course:', slugOrId);
      
      // Try RPC function first (for slug lookups)
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_published_course_by_slug', {
        p_slug: slugOrId
      });

      console.log('[useCourse] RPC result:', { 
        foundCourses: rpcData?.length, 
        hasError: !!rpcError,
        error: rpcError 
      });

      if (!rpcError && rpcData && rpcData.length > 0) {
        console.log('[useCourse] Returning course from RPC:', rpcData[0].slug);
        return rpcData[0] as Course;
      }

      // Fallback to direct query for ID lookups or if RPC fails
      console.log('[useCourse] Fallback to direct query');
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(`id.eq.${slugOrId},slug.eq.${slugOrId}`)
        .maybeSingle();

      if (error) {
        console.error('[useCourse] Direct query error:', error);
        throw error;
      }

      console.log('[useCourse] Direct query result:', data ? data.slug : 'null');
      return data as Course | null;
    },
    enabled: !!slugOrId,
    staleTime: 0, // Disable caching to force fresh fetch
  });

  return {
    course,
    isLoading,
    error,
    refetch
  };
}

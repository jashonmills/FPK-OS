
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  return {
    courses,
    isLoading,
    error,
    refetch
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

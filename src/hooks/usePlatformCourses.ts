import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformCourse {
  id: string;
  title: string;
  description?: string;
  difficulty_level?: string;
  course_visibility: string;
  thumbnail_url?: string;
  duration_minutes?: number;
  instructor_name?: string;
  featured?: boolean;
  tags?: string[];
  slug?: string;
  framework_type?: string;
  content_version?: string;
}

export function usePlatformCourses() {
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['platform-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('course_visibility', 'global')
        .eq('status', 'published')
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching platform courses:', error);
        throw error;
      }

      return data as PlatformCourse[];
    },
    staleTime: 0, // Always fetch fresh data
  });

  return {
    courses,
    isLoading,
    error,
  };
}
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlatformCourse {
  id: string;
  title: string;
  description?: string;
  difficulty_level?: string;
  course_visibility: string;
  thumbnail_url?: string;
  background_image?: string;
  duration_minutes?: number;
  instructor_name?: string;
  featured?: boolean;
  tags?: string[];
  slug?: string;
  framework_type?: string;
  content_version?: string;
}

export function usePlatformCourses() {
  // Duplicate course IDs to exclude (moved to review-later)
  const excludedDuplicateIds = [
    'cafa546e-92f0-4807-b4eb-50e8f81ccaa4', // chemistry-the-central-science (duplicate)
    '71ea4884-098b-4854-bfa1-1715689bbb25', // introduction-to-data-science (duplicate)
    '2def03d8-35bc-48d2-995c-5a774219177f', // public-speaking-and-debate (duplicate)
    'e397be7a-1e74-48a7-a3d4-69c8e52568f6', // personal-finance-and-investing (duplicate)
  ];

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['platform-courses-v4'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('course_visibility', 'global')
        .eq('status', 'published')
        .not('id', 'in', `(${excludedDuplicateIds.join(',')})`)
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching platform courses:', error);
        throw error;
      }

      return data as PlatformCourse[];
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Force refetch on mount
  });

  return {
    courses,
    isLoading,
    error,
  };
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Module {
  id: string;
  course_id: string;
  module_number: number;
  title: string;
  description?: string;
  content_type: string;
  duration_minutes: number;
  metadata: any;
  is_published: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export function useModules(courseId: string) {
  const { data: modules = [], isLoading, error, refetch } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('module_number', { ascending: true });

      if (error) {
        console.error('Error fetching modules:', error);
        throw error;
      }

      return data as Module[];
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    modules,
    isLoading,
    error,
    refetch
  };
}

export function useModule(moduleId: string) {
  const { data: module, isLoading, error, refetch } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: async () => {
      if (!moduleId) return null;

      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) {
        console.error('Error fetching module:', error);
        throw error;
      }

      return data as Module;
    },
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    module,
    isLoading,
    error,
    refetch
  };
}

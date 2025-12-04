import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  lesson_number: number;
  content_type: string | null;
  video_url: string | null;
  audio_url: string | null;
  transcript: string | null;
  transcript_url: string | null;
  duration_minutes: number | null;
  is_published: boolean | null;
  sort_order: number | null;
  scorm_package_url: string | null;
  scorm_manifest: any | null;
  scorm_completion_criteria: any | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonData {
  course_id: string;
  title: string;
  description?: string;
  lesson_number: number;
  content_type?: string;
  video_url?: string;
  audio_url?: string;
  transcript?: string;
  transcript_url?: string;
  duration_minutes?: number;
  is_published?: boolean;
  sort_order?: number;
  scorm_package_url?: string;
  scorm_manifest?: any;
  scorm_completion_criteria?: any;
}

export function useLessons(courseId?: string) {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching lessons:', error);
        throw error;
      }

      return data as Lesson[];
    },
    enabled: !!courseId,
  });
}

export function useLesson(lessonId?: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      if (!lessonId) return null;
      
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) {
        console.error('Error fetching lesson:', error);
        throw error;
      }

      return data as Lesson;
    },
    enabled: !!lessonId,
  });
}

export function useLessonMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createLesson = useMutation({
    mutationFn: async (lessonData: CreateLessonData) => {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      toast({
        title: "Success",
        description: "Lesson created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to create lesson.",
        variant: "destructive",
      });
    },
  });

  const updateLesson = useMutation({
    mutationFn: async ({ id, ...lessonData }: Partial<Lesson> & { id: string }) => {
      const { data, error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lesson', data.id] });
      toast({
        title: "Success",
        description: "Lesson updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to update lesson.",
        variant: "destructive",
      });
    },
  });

  const deleteLesson = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      return lessonId;
    },
    onSuccess: (lessonId) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.removeQueries({ queryKey: ['lesson', lessonId] });
      toast({
        title: "Success",
        description: "Lesson deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting lesson:', error);
      toast({
        title: "Error",
        description: "Failed to delete lesson.",
        variant: "destructive",
      });
    },
  });

  return {
    createLesson,
    updateLesson,
    deleteLesson,
    isCreating: createLesson.isPending,
    isUpdating: updateLesson.isPending,
    isDeleting: deleteLesson.isPending,
  };
}
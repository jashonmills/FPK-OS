
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ModuleFormData {
  course_id: string;
  module_number: number;
  title: string;
  description?: string;
  content_type: string;
  duration_minutes: number;
  is_published: boolean;
  video_url?: string;
  audio_url?: string;
  pdf_url?: string;
  word_url?: string;
  image_url?: string;
}

export function useModuleMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createModule = useMutation({
    mutationFn: async (moduleData: ModuleFormData) => {
      const { data, error } = await supabase
        .from('modules')
        .insert({
          ...moduleData,
          metadata: {
            video_url: moduleData.video_url,
            audio_url: moduleData.audio_url,
            pdf_url: moduleData.pdf_url,
            word_url: moduleData.word_url,
            image_url: moduleData.image_url
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast({
        title: "Success",
        description: "Module created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating module:', error);
      toast({
        title: "Error",
        description: "Failed to create module.",
        variant: "destructive",
      });
    },
  });

  const updateModule = useMutation({
    mutationFn: async (moduleData: Partial<ModuleFormData> & { id: string }) => {
      const { id, ...updateData } = moduleData;
      const { data, error } = await supabase
        .from('modules')
        .update({
          ...updateData,
          metadata: {
            video_url: updateData.video_url,
            audio_url: updateData.audio_url,
            pdf_url: updateData.pdf_url,
            word_url: updateData.word_url,
            image_url: updateData.image_url
          }
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast({
        title: "Success",
        description: "Module updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating module:', error);
      toast({
        title: "Error",
        description: "Failed to update module.",
        variant: "destructive",
      });
    },
  });

  const deleteModule = useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast({
        title: "Success",
        description: "Module deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting module:', error);
      toast({
        title: "Error",
        description: "Failed to delete module.",
        variant: "destructive",
      });
    },
  });

  return {
    createModule: createModule.mutate,
    updateModule: updateModule.mutate,
    deleteModule: deleteModule.mutate,
    isCreating: createModule.isPending,
    isUpdating: updateModule.isPending,
    isDeleting: deleteModule.isPending,
  };
}

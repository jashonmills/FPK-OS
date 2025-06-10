
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FileUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  generated_flashcards_count: number | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export const useFileUploads = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: uploads = [], isLoading } = useQuery({
    queryKey: ['file-uploads', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching file uploads:', error);
        throw error;
      }

      return data as FileUpload[];
    },
    enabled: !!user,
  });

  const createUploadMutation = useMutation({
    mutationFn: async (uploadData: {
      file_name: string;
      file_size: number;
      file_type: string;
      storage_path: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('file_uploads')
        .insert({
          user_id: user.id,
          file_name: uploadData.file_name,
          file_size: uploadData.file_size,
          file_type: uploadData.file_type,
          storage_path: uploadData.storage_path,
          processing_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-uploads', user?.id] });
    },
  });

  const updateUploadMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FileUpload> & { id: string }) => {
      const { data, error } = await supabase
        .from('file_uploads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-uploads', user?.id] });
    },
  });

  const deleteUploadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-uploads', user?.id] });
    },
  });

  return {
    uploads,
    isLoading,
    createUpload: createUploadMutation.mutate,
    updateUpload: updateUploadMutation.mutate,
    deleteUpload: deleteUploadMutation.mutate,
    isCreating: createUploadMutation.isPending,
    isUpdating: updateUploadMutation.isPending,
    isDeleting: deleteUploadMutation.isPending,
  };
};

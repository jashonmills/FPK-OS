
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface KnowledgeBaseFile {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  uploaded_at: string;
  processed: boolean;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useKnowledgeBaseFiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ['knowledge-base-files', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('knowledge_base_files')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching KB files:', error);
        throw error;
      }

      return data as KnowledgeBaseFile[];
    },
    enabled: !!user?.id,
  });

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('kb_files')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Create database record
      const { data: fileRecord, error: dbError } = await supabase
        .from('knowledge_base_files')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_path: filePath,
        })
        .select()
        .single();

      if (dbError) {
        // Cleanup uploaded file if DB insert fails
        await supabase.storage.from('kb_files').remove([filePath]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      // Process file for embeddings
      try {
        await supabase.functions.invoke('process-kb-file', {
          body: { fileId: fileRecord.id }
        });
      } catch (processError) {
        console.warn('File uploaded but processing failed:', processError);
        toast({
          title: "File uploaded",
          description: "File uploaded successfully, but processing failed. It will be retried later.",
          variant: "default"
        });
      }

      return fileRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base-files'] });
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded and is being processed for AI integration.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get file info first
      const { data: fileRecord } = await supabase
        .from('knowledge_base_files')
        .select('storage_path')
        .eq('id', fileId)
        .eq('user_id', user.id)
        .single();

      if (!fileRecord) {
        throw new Error('File not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('kb_files')
        .remove([fileRecord.storage_path]);

      if (storageError) {
        console.warn('Storage deletion failed:', storageError);
      }

      // Delete embeddings
      await supabase
        .from('knowledge_embeddings')
        .delete()
        .eq('user_id', user.id)
        .eq('metadata->>file_id', fileId);

      // Delete database record
      const { error: dbError } = await supabase
        .from('knowledge_base_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id);

      if (dbError) {
        throw new Error(`Failed to delete file: ${dbError.message}`);
      }

      return fileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-base-files'] });
      toast({
        title: "File deleted",
        description: "File and its AI embeddings have been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  return {
    files,
    isLoading,
    error,
    uploadFile: uploadFile.mutate,
    deleteFile: deleteFile.mutate,
    isUploading: uploadFile.isPending,
    isDeleting: deleteFile.isPending,
  };
};

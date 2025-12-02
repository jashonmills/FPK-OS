import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useMessageAttachments() {
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadAttachment = useCallback(async (
    messageId: string,
    file: File
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${messageId}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create attachment record
      const { error: dbError } = await supabase
        .from('message_attachments')
        .insert({
          message_id: messageId,
          file_path: fileName,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size
        });

      if (dbError) throw dbError;

      return fileName;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload attachment',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, toast]);

  const getAttachmentUrl = useCallback(async (filePath: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting attachment URL:', error);
      return null;
    }
  }, []);

  const deleteAttachment = useCallback(async (attachmentId: string, filePath: string): Promise<boolean> => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('message-attachments')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete record
      const { error: dbError } = await supabase
        .from('message_attachments')
        .delete()
        .eq('id', attachmentId);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete attachment',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  return {
    uploadAttachment,
    getAttachmentUrl,
    deleteAttachment
  };
}

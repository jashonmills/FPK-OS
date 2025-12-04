
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, fileName: string) => {
    setIsUploading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('course-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "File uploaded successfully.",
      });

      return { data, error: null };
    } catch (error) {
      const uploadError = error as Error;
      console.error('Upload error:', uploadError);
      toast({
        title: "Upload Error",
        description: uploadError.message || "Failed to upload file.",
        variant: "destructive",
      });
      return { data: null, error: uploadError };
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('course-files')
        .remove([fileName]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "File deleted successfully.",
      });

      return { error: null };
    } catch (error) {
      const deleteError = error as Error;
      console.error('Delete error:', deleteError);
      toast({
        title: "Delete Error",
        description: deleteError.message || "Failed to delete file.",
        variant: "destructive",
      });
      return { error: deleteError };
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading
  };
}


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
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
      return { data: null, error };
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
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Error",
        description: error.message || "Failed to delete file.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading
  };
}

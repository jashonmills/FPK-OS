
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type CourseMedia = Database['public']['Tables']['course_media']['Row'];

export const useCourseMedia = (moduleId?: string) => {
  const [media, setMedia] = useState<CourseMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Load media for a module
  const loadMedia = async () => {
    if (!moduleId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_media')
        .select('*')
        .eq('module_id', moduleId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: "Error loading media",
        description: "Failed to load course media.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Upload media file
  const uploadMedia = async (file: File, mediaType: 'video' | 'audio' | 'document' | 'image') => {
    if (!moduleId) {
      toast({
        title: "Error",
        description: "Module ID is required for media upload.",
        variant: "destructive"
      });
      return null;
    }

    setIsUploading(true);
    try {
      // Determine bucket based on media type
      const bucketMap = {
        video: 'course-videos',
        audio: 'course-audio',
        document: 'course-documents',
        image: 'course-images'
      };

      const bucket = bucketMap[mediaType];
      const fileName = `${moduleId}/${Date.now()}-${file.name}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Create media record
      const { data: mediaData, error: mediaError } = await supabase
        .from('course_media')
        .insert({
          module_id: moduleId,
          media_type: mediaType,
          file_name: file.name,
          file_path: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          metadata: {}
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      setMedia(prev => [...prev, mediaData]);
      
      toast({
        title: "Media uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });

      return mediaData;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload media file.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Delete media
  const deleteMedia = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from('course_media')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;

      setMedia(prev => prev.filter(m => m.id !== mediaId));
      
      toast({
        title: "Media deleted",
        description: "Media file has been removed.",
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete media file.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadMedia();
  }, [moduleId]);

  return {
    media,
    isLoading,
    isUploading,
    uploadMedia,
    deleteMedia,
    loadMedia
  };
};

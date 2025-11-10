import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface StudyMaterial {
  id: string;
  title: string;
  file_type: string;
  file_size: number;
  file_url: string;
  created_at: string;
}

export function useAICoachStudyMaterials(orgId?: string) {
  const { user } = useAuth();
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);

  const fetchStudyMaterials = async () => {
    if (!user?.id) {
      setIsLoadingMaterials(false);
      return;
    }

    try {
      setIsLoadingMaterials(true);
      
      let query: any = supabase
        .from('ai_coach_study_materials')
        .select('id, title, file_type, file_size, file_url, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (orgId) {
        query = query.eq('org_id', orgId);
      }
      
      const { data, error } = await query;

      if (error) throw error;

      setStudyMaterials(data || []);
    } catch (error) {
      console.error('Error fetching study materials:', error);
      toast.error('Failed to load study materials');
      setStudyMaterials([]);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  const uploadMaterial = async (file: File): Promise<string | null> => {
    if (!user?.id) {
      toast.error('You must be logged in to upload materials');
      return null;
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit');
      return null;
    }

    try {
      // Step 1: Sanitize filename - remove emojis and special characters
      const sanitizedFileName = file.name
        .replace(/[^\w\s.-]/g, '') // Remove emojis and special chars
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .trim();
      
      // Step 2: Upload to Supabase Storage
      const filePath = `${user.id}/${Date.now()}_${sanitizedFileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ai-coach-materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Step 2: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ai-coach-materials')
        .getPublicUrl(filePath);

      // Step 3: Create database record
      const insertData: any = {
        user_id: user.id,
        title: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: publicUrl
      };

      if (orgId) {
        insertData.org_id = orgId;
      }

      const { data: insertedData, error: dbError } = await supabase
        .from('ai_coach_study_materials')
        .insert(insertData)
        .select('id')
        .single();

      if (dbError) throw dbError;

      toast.success('Study material uploaded successfully!');
      
      // Refresh materials list
      await fetchStudyMaterials();
      return insertedData?.id || null;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload material');
      return null;
    }
  };

  const deleteMaterial = async (materialId: string, fileUrl: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      // Step 1: Delete from database
      const { error: dbError } = await supabase
        .from('ai_coach_study_materials')
        .delete()
        .eq('id', materialId)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      // Step 2: Delete from storage
      const filePath = fileUrl.split('/ai-coach-materials/')[1];
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('ai-coach-materials')
          .remove([filePath]);

        if (storageError) console.warn('Storage deletion warning:', storageError);
      }

      toast.success('Study material deleted');
      
      // Refresh materials list
      await fetchStudyMaterials();
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete material');
      return false;
    }
  };

  useEffect(() => {
    fetchStudyMaterials();
  }, [user?.id, orgId]);

  const assignToFolder = async (materialId: string, folderId: string | null): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('ai_coach_study_materials')
        .update({ folder_id: folderId })
        .eq('id', materialId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(folderId ? 'Material moved to folder' : 'Material removed from folder');
      await fetchStudyMaterials();
      return true;
    } catch (error) {
      console.error('Error assigning material to folder:', error);
      toast.error('Failed to organize material');
      return false;
    }
  };

  return {
    studyMaterials,
    isLoadingMaterials,
    uploadMaterial,
    deleteMaterial,
    assignToFolder,
    refetchMaterials: fetchStudyMaterials
  };
}

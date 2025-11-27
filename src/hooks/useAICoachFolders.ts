import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Folder {
  id: string;
  user_id: string;
  org_id: string | null;
  name: string;
  folder_type: 'study_material' | 'saved_chat';
  created_at: string;
  updated_at: string;
  item_count?: number;
}

export function useAICoachFolders(
  folderType: 'study_material' | 'saved_chat',
  orgId?: string
) {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);

  const fetchFolders = async () => {
    if (!user?.id) {
      setIsLoadingFolders(false);
      return;
    }

    try {
      setIsLoadingFolders(true);
      
      let query = supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .eq('folder_type', folderType)
        .order('name', { ascending: true });
      
      if (orgId) {
        query = query.eq('org_id', orgId);
      }
      
      const { data: foldersData, error } = await query;

      if (error) throw error;

      // Get item counts for each folder
      const foldersWithCounts = await Promise.all(
        (foldersData || []).map(async (folder) => {
          const tableName = folderType === 'study_material' 
            ? 'ai_coach_study_materials' 
            : 'ai_coach_conversations';
          
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
            .eq('folder_id', folder.id);

          return { 
            ...folder, 
            folder_type: folder.folder_type as 'study_material' | 'saved_chat',
            item_count: count || 0 
          };
        })
      );

      setFolders(foldersWithCounts);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
      setFolders([]);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const createFolder = async (name: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const insertData: any = {
        user_id: user.id,
        name,
        folder_type: folderType
      };

      if (orgId) {
        insertData.org_id = orgId;
      }

      const { error } = await supabase
        .from('folders')
        .insert(insertData);

      if (error) throw error;

      toast.success('Folder created successfully');
      await fetchFolders();
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
      return false;
    }
  };

  const renameFolder = async (folderId: string, newName: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('folders')
        .update({ name: newName })
        .eq('id', folderId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Folder renamed');
      await fetchFolders();
      return true;
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast.error('Failed to rename folder');
      return false;
    }
  };

  const deleteFolder = async (folderId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Folder deleted');
      await fetchFolders();
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
      return false;
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [user?.id, orgId, folderType]);

  return {
    folders,
    isLoadingFolders,
    createFolder,
    renameFolder,
    deleteFolder,
    refetchFolders: fetchFolders
  };
}

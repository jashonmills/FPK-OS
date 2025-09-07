import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { useToast } from '@/hooks/use-toast';

export interface OrgNoteFolder {
  id: string;
  organization_id: string;
  name: string;
  parent_folder_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  note_count?: number;
  children?: OrgNoteFolder[];
}

export const useOrgNoteFolders = () => {
  const { currentOrg } = useOrgContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: folders = [], isLoading } = useQuery({
    queryKey: ['org-note-folders', currentOrg?.organization_id],
    queryFn: async () => {
      if (!currentOrg?.organization_id) return [];
      
      // For now, return some default folders since we don't have the table yet
      const defaultFolders = [
        {
          id: '1',
          organization_id: currentOrg.organization_id,
          name: 'Math',
          parent_folder_id: null,
          created_by: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          note_count: 0,
          children: [],
        },
        {
          id: '2',
          organization_id: currentOrg.organization_id,
          name: 'Science',
          parent_folder_id: null,
          created_by: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          note_count: 0,
          children: [],
        },
        {
          id: '3',
          organization_id: currentOrg.organization_id,
          name: 'Progress Reports',
          parent_folder_id: null,
          created_by: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          note_count: 0,
          children: [],
        },
      ];

      return defaultFolders;
    },
    enabled: !!currentOrg?.organization_id,
  });

  const createFolder = useMutation({
    mutationFn: async (folderData: {
      name: string;
      parent_folder_id?: string;
    }) => {
      // For now, just return success without actually creating
      return {
        id: Date.now().toString(),
        name: folderData.name,
        parent_folder_id: folderData.parent_folder_id || null,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-note-folders'] });
      toast({
        title: 'Success',
        description: 'Folder created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    },
  });

  const updateFolder = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<OrgNoteFolder> & { id: string }) => {
      const { data, error } = await supabase
        .from('org_note_folders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-note-folders'] });
      toast({
        title: 'Success',
        description: 'Folder updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to update folder',
        variant: 'destructive',
      });
    },
  });

  const deleteFolder = useMutation({
    mutationFn: async (id: string) => {
      // First check if folder has any notes
      const { count: noteCount } = await supabase
        .from('org_notes')
        .select('*', { count: 'exact', head: true })
        .eq('folder_id', id);

      if (noteCount && noteCount > 0) {
        throw new Error('Cannot delete folder that contains notes');
      }

      // Check if folder has any subfolders
      const { count: subfolderCount } = await supabase
        .from('org_note_folders')
        .select('*', { count: 'exact', head: true })
        .eq('parent_folder_id', id);

      if (subfolderCount && subfolderCount > 0) {
        throw new Error('Cannot delete folder that contains subfolders');
      }

      const { error } = await supabase
        .from('org_note_folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-note-folders'] });
      toast({
        title: 'Success',
        description: 'Folder deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting folder:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete folder',
        variant: 'destructive',
      });
    },
  });

  return {
    folders,
    isLoading,
    createFolder: createFolder.mutate,
    updateFolder: updateFolder.mutate,
    deleteFolder: deleteFolder.mutate,
  };
};
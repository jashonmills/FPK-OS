import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { assertOrg } from '@/lib/org/context';

export interface OrgNoteFolder {
  id: string;
  org_id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrgNote {
  id: string;
  organization_id: string;
  created_by: string;
  student_id: string | null;
  title: string;
  content: string;
  category: string;
  folder_path: string;
  visibility_scope: 'student-only' | 'instructor-visible' | 'org-public';
  is_private: boolean;
  tags: string[];
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface NoteTarget {
  note_id: string;
  user_id: string;
  created_at: string;
}

export function useOrgNoteFolders(organizationId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use provided organizationId or fall back to empty string for graceful degradation
  const orgId = organizationId || '';

  const { data: folders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-note-folders', orgId],
    queryFn: async () => {
      if (!orgId) {
        // Return empty array if no organization ID
        return [];
      }

      const { data, error } = await supabase
        .from('org_note_folders')
        .select('*')
        .eq('org_id', orgId)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching org note folders:', error);
        throw error;
      }

      return data as any[];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!orgId, // Only run query if we have an org ID
  });

  const createFolderMutation = useMutation({
    mutationFn: async (folderData: { name: string }) => {
      if (!orgId) {
        throw new Error('Organization ID is required to create folders');
      }

      const { data, error } = await supabase
        .from('org_note_folders')
        .insert({
          ...folderData,
          org_id: orgId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-note-folders'] });
      toast({
        title: "Success",
        description: "Folder created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder.",
        variant: "destructive",
      });
    },
  });

  return {
    folders,
    isLoading,
    error,
    refetch,
    createFolder: createFolderMutation.mutate,
    isCreating: createFolderMutation.isPending,
  };
}

export function useOrgNotes(organizationId?: string, folderId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use provided organizationId or fall back to empty string for graceful degradation
  const orgId = organizationId || '';

  const { data: notes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-notes', orgId, folderId],
    queryFn: async () => {
      if (!orgId) {
        // Return empty array if no organization ID
        return [];
      }

      let query = supabase
        .from('org_notes')
        .select('*')
        .eq('organization_id', orgId);

      if (folderId) {
        query = query.eq('folder_path', `/${folderId}/`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching org notes:', error);
        throw error;
      }

      return data as OrgNote[];
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!orgId, // Only run query if we have an org ID
  });

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string; category: string; student_id?: string; folder_path?: string }) => {
      if (!orgId) {
        throw new Error('Organization ID is required to create notes');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated');
      }

      // Create note using existing table structure
      const { data: noteResult, error: noteError } = await supabase
        .from('org_notes')
        .insert({
          title: noteData.title,
          content: noteData.content,
          category: noteData.category,
          organization_id: orgId,
          created_by: user.id,
          student_id: noteData.student_id || null,
          folder_path: noteData.folder_path || '/',
          visibility_scope: 'instructor-visible' as const,
          is_private: false,
          tags: [],
          metadata: {},
        })
        .select()
        .single();

      if (noteError) throw noteError;
      return noteResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-notes'] });
      toast({
        title: "Success",
        description: "Note created successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note.",
        variant: "destructive",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (noteData: Partial<OrgNote> & { id: string }) => {
      if (!orgId) {
        throw new Error('Organization ID is required to update notes');
      }

      const { id, ...updateData } = noteData;
      const { data, error } = await supabase
        .from('org_notes')
        .update(updateData)
        .eq('id', id)
        .eq('organization_id', orgId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-notes'] });
      toast({
        title: "Success",
        description: "Note updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note.",
        variant: "destructive",
      });
    },
  });

  return {
    notes,
    isLoading,
    error,
    refetch,
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
  };
}
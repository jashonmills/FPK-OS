import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { toast } from 'sonner';

export interface OrgNote {
  id: string;
  title: string;
  content: string;
  student_id: string;
  visibility_scope: string;
  category?: string;
  tags?: string[];
  folder_path?: string;
  is_private?: boolean;
  created_at: string;
  updated_at: string;
  student_name?: string;
}

export function useOrgNotes(searchQuery?: string, visibilityFilter?: string) {
  const { currentOrg } = useOrgContext();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['org-notes', currentOrg?.organization_id, searchQuery, visibilityFilter],
    queryFn: async (): Promise<OrgNote[]> => {
      if (!currentOrg?.organization_id) {
        throw new Error('No organization selected');
      }

      let query = supabase
        .from('org_notes')
        .select('*')
        .eq('organization_id', currentOrg.organization_id)
        .order('updated_at', { ascending: false });

      // Apply visibility filter
      if (visibilityFilter && visibilityFilter !== 'all' && visibilityFilter !== 'private') {
        query = query.eq('visibility_scope', visibilityFilter as any);
      } else if (visibilityFilter === 'private') {
        query = query.eq('is_private', true);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(note => ({
        ...note,
        student_name: 'Student' // Placeholder - would need profile lookup
      }));
    },
    enabled: !!currentOrg?.organization_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createNote = useMutation({
    mutationFn: async (noteData: Partial<OrgNote> & { created_by: string }) => {
      if (!currentOrg?.organization_id) {
        throw new Error('No organization selected');
      }

      const { data, error } = await supabase
        .from('org_notes')
        .insert({
          title: noteData.title || '',
          content: noteData.content || '',
          student_id: noteData.student_id || '',
          visibility_scope: (noteData.visibility_scope || 'instructor-visible') as any,
          category: noteData.category,
          tags: noteData.tags,
          folder_path: noteData.folder_path,
          is_private: noteData.is_private || false,
          organization_id: currentOrg.organization_id,
          created_by: noteData.created_by,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-notes'] });
      toast.success('Note created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create note: ' + error.message);
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, student_name, ...updates }: Partial<OrgNote> & { id: string }) => {
      const { data, error } = await supabase
        .from('org_notes')
        .update({
          ...updates,
          visibility_scope: updates.visibility_scope as any
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-notes'] });
      toast.success('Note updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update note: ' + error.message);
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('org_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-notes'] });
      toast.success('Note deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete note: ' + error.message);
    },
  });

  return {
    notes: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createNote: createNote.mutate,
    updateNote: updateNote.mutate,
    deleteNote: deleteNote.mutate,
    isCreating: createNote.isPending,
    isUpdating: updateNote.isPending,
    isDeleting: deleteNote.isPending,
  };
}
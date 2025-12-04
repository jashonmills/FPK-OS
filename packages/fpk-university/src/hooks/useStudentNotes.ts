import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentNote {
  id: string;
  student_id: string;
  org_id: string;
  author_id: string;
  title?: string;
  content: string;
  note_type: 'general' | 'academic' | 'behavioral' | 'administrative' | 'medical';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_private: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateNoteData {
  student_id: string;
  org_id: string;
  title?: string;
  content: string;
  note_type?: 'general' | 'academic' | 'behavioral' | 'administrative' | 'medical';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  is_private?: boolean;
  tags?: string[];
}

export function useStudentNotes(studentId?: string, orgId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notes
  const { data: notes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['student-notes', studentId, orgId],
    queryFn: async () => {
      let query = supabase.from('student_notes').select('*');
      
      if (studentId) {
        query = query.eq('student_id', studentId);
      }
      if (orgId) {
        query = query.eq('org_id', orgId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StudentNote[];
    },
    enabled: !!(studentId || orgId),
    staleTime: 5 * 60 * 1000,
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: CreateNoteData) => {
      const { data, error } = await supabase
        .from('student_notes')
        .insert({
          ...noteData,
          author_id: (await supabase.auth.getUser()).data.user?.id!,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notes'] });
      toast({
        title: "Note Added",
        description: "The note has been successfully added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add note.",
        variant: "destructive",
      });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StudentNote> }) => {
      const { data, error } = await supabase
        .from('student_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notes'] });
      toast({
        title: "Note Updated",
        description: "The note has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update note.",
        variant: "destructive",
      });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('student_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notes'] });
      toast({
        title: "Note Deleted",
        description: "The note has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete note.",
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
    deleteNote: deleteNoteMutation.mutate,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  };
}
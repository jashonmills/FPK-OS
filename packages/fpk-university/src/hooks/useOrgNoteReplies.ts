import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OrgNoteReply {
  id: string;
  note_id: string;
  user_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  updated_at: string;
}

export function useOrgNoteReplies(noteId: string) {
  const queryClient = useQueryClient();

  const { data: replies = [], isLoading, error, refetch } = useQuery({
    queryKey: ['org-note-replies', noteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('org_note_replies')
        .select('*')
        .eq('note_id', noteId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching note replies:', error);
        throw error;
      }

      return data as OrgNoteReply[];
    },
    enabled: !!noteId,
  });

  const createReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('org_note_replies')
        .insert({
          note_id: noteId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-note-replies', noteId] });
      toast.success('Reply added successfully');
    },
    onError: (error) => {
      console.error('Error creating reply:', error);
      toast.error('Failed to add reply');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (replyId: string) => {
      const { error } = await supabase
        .from('org_note_replies')
        .update({ read_at: new Date().toISOString() })
        .eq('id', replyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-note-replies', noteId] });
    },
  });

  return {
    replies,
    isLoading,
    error,
    refetch,
    createReply: createReplyMutation.mutate,
    isCreatingReply: createReplyMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
  };
}

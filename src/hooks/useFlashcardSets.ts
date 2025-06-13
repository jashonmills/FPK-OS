
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FlashcardSet {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  source_type: 'upload' | 'manual' | 'notes';
  source_id: string | null;
  created_at: string;
  updated_at: string;
  flashcard_count?: number;
}

export const useFlashcardSets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sets = [], isLoading } = useQuery({
    queryKey: ['flashcard-sets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select(`
          *,
          flashcard_count:flashcards(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching flashcard sets:', error);
        throw error;
      }

      return data.map(set => ({
        ...set,
        flashcard_count: set.flashcard_count?.[0]?.count || 0
      })) as FlashcardSet[];
    },
    enabled: !!user,
  });

  const createSetMutation = useMutation({
    mutationFn: async (setData: {
      name: string;
      description?: string;
      source_type: 'upload' | 'manual' | 'notes';
      source_id?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('flashcard_sets')
        .insert({
          user_id: user.id,
          name: setData.name,
          description: setData.description || null,
          source_type: setData.source_type,
          source_id: setData.source_id || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-sets', user?.id] });
    },
  });

  const updateSetMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FlashcardSet> & { id: string }) => {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-sets', user?.id] });
    },
  });

  const deleteSetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-sets', user?.id] });
    },
  });

  return {
    sets,
    isLoading,
    createSet: createSetMutation.mutate,
    updateSet: updateSetMutation.mutate,
    deleteSet: deleteSetMutation.mutate,
    isCreating: createSetMutation.isPending,
    isUpdating: updateSetMutation.isPending,
    isDeleting: deleteSetMutation.isPending,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useXPIntegration } from './useXPIntegration';
import { trackDailyActivity } from '@/utils/analyticsTracking';

export interface Flashcard {
  id: string;
  user_id: string;
  note_id: string | null;
  front_content: string;
  back_content: string;
  difficulty_level: number;
  times_reviewed: number;
  times_correct: number;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useFlashcards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { awardFlashcardCreationXP } = useXPIntegration();

  const { data: flashcards = [], isLoading } = useQuery({
    queryKey: ['flashcards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching flashcards:', error);
        throw error;
      }

      return data as Flashcard[];
    },
    enabled: !!user,
  });

  const createFlashcardMutation = useMutation({
    mutationFn: async (flashcardData: { 
      front_content: string; 
      back_content: string; 
      note_id?: string;
      difficulty_level?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('💾 Creating flashcard in database:', flashcardData);

      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          user_id: user.id,
          front_content: flashcardData.front_content,
          back_content: flashcardData.back_content,
          note_id: flashcardData.note_id || null,
          difficulty_level: flashcardData.difficulty_level || 1
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error creating flashcard:', error);
        throw error;
      }
      
      console.log('✅ Flashcard created successfully:', data);
      return data;
    },
    onSuccess: async () => {
      console.log('🔄 Invalidating flashcard queries after successful creation');
      queryClient.invalidateQueries({ queryKey: ['flashcards', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['flashcard-sets', user?.id] });
      
      // Award XP for flashcard creation
      try {
        await awardFlashcardCreationXP();
        console.log('🎮 XP awarded for flashcard creation');
      } catch (error) {
        console.warn('Failed to award XP for flashcard creation:', error);
      }
      
      // Track daily activity (use 'study' as the activity type)
      if (user?.id) {
        trackDailyActivity('study', 0, user.id).catch(err => 
          console.warn('Failed to track flashcard activity:', err)
        );
      }
    },
  });

  const updateFlashcardMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Flashcard> & { id: string }) => {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', user?.id] });
    },
  });

  const deleteFlashcardMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', user?.id] });
    },
  });

  // Enhanced createFlashcard function with callback support
  const createFlashcard = (
    flashcardData: { 
      front_content: string; 
      back_content: string; 
      note_id?: string;
      difficulty_level?: number;
    },
    callbacks?: {
      onSuccess?: (data: Flashcard) => void;
      onError?: (error: Error) => void;
    }
  ) => {
    createFlashcardMutation.mutate(flashcardData, {
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError,
    });
  };

  return {
    flashcards,
    isLoading,
    createFlashcard,
    updateFlashcard: updateFlashcardMutation.mutate,
    deleteFlashcard: deleteFlashcardMutation.mutate,
    isCreating: createFlashcardMutation.isPending,
    isUpdating: updateFlashcardMutation.isPending,
    isDeleting: deleteFlashcardMutation.isPending,
  };
};

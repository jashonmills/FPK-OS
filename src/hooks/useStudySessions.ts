
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface StudySession {
  id: string;
  user_id: string;
  session_type: 'memory_test' | 'multiple_choice' | 'timed_challenge';
  flashcard_ids: string[];
  total_cards: number;
  correct_answers: number;
  incorrect_answers: number;
  session_duration_seconds: number | null;
  completed_at: string | null;
  created_at: string;
}

export const useStudySessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['study-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching study sessions:', error);
        throw error;
      }

      return data as StudySession[];
    },
    enabled: !!user,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: {
      session_type: StudySession['session_type'];
      flashcard_ids: string[];
      total_cards: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionData.session_type,
          flashcard_ids: sessionData.flashcard_ids,
          total_cards: sessionData.total_cards
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions', user?.id] });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async ({ 
      id, 
      correct_answers, 
      incorrect_answers, 
      session_duration_seconds 
    }: {
      id: string;
      correct_answers: number;
      incorrect_answers: number;
      session_duration_seconds: number;
    }) => {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          correct_answers,
          incorrect_answers,
          session_duration_seconds,
          completed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions', user?.id] });
    },
  });

  return {
    sessions,
    isLoading,
    createSession: createSessionMutation.mutate,
    completeSession: completeSessionMutation.mutate,
    isCreating: createSessionMutation.isPending,
    isCompleting: completeSessionMutation.isPending,
  };
};

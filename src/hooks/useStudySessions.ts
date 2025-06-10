
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

      console.log('Fetched study sessions:', data);
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

      console.log('Creating session with data:', sessionData);

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

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      console.log('Created session:', data);
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
      console.log('Completing session:', {
        id,
        correct_answers,
        incorrect_answers,
        session_duration_seconds
      });

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

      if (error) {
        console.error('Error completing session:', error);
        throw error;
      }

      console.log('Session completed:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Session completion successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['study-sessions', user?.id] });
    },
  });

  return {
    sessions,
    isLoading,
    createSession: createSessionMutation.mutateAsync,
    completeSession: completeSessionMutation.mutateAsync,
    isCreating: createSessionMutation.isPending,
    isCompleting: completeSessionMutation.isPending,
  };
};

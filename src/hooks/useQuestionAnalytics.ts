import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface TrackQuestionParams {
  courseId: string;
  lessonId: number;
  questionId: string;
  questionText: string;
  answerGiven: string;
  correctAnswer?: string;
  isCorrect: boolean;
  timeSpentSeconds?: number;
  metadata?: Record<string, any>;
}

export function useQuestionAnalytics() {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);

  const trackQuestionResponse = async (params: TrackQuestionParams) => {
    if (!user?.id) {
      console.warn('User not authenticated, skipping question tracking');
      return;
    }

    setIsTracking(true);
    try {
      const { error } = await supabase
        .from('question_responses')
        .insert({
          user_id: user.id,
          course_id: params.courseId,
          lesson_id: params.lessonId,
          question_id: params.questionId,
          question_text: params.questionText,
          answer_given: params.answerGiven,
          correct_answer: params.correctAnswer,
          is_correct: params.isCorrect,
          time_spent_seconds: params.timeSpentSeconds || 0,
          metadata: params.metadata || {}
        });

      if (error) throw error;

      // Note: XP awarding will be handled separately when integrated with XP system
    } catch (error) {
      console.error('Error tracking question response:', error);
      toast.error('Failed to track question response');
    } finally {
      setIsTracking(false);
    }
  };

  const getQuestionStats = async (courseId: string, lessonId?: number) => {
    if (!user?.id) return null;

    try {
      let query = supabase
        .from('question_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (lessonId !== undefined) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const total = data?.length || 0;
      const correct = data?.filter(r => r.is_correct).length || 0;
      const accuracy = total > 0 ? (correct / total) * 100 : 0;
      const avgTime = total > 0 
        ? data.reduce((sum, r) => sum + (r.time_spent_seconds || 0), 0) / total 
        : 0;

      return {
        total,
        correct,
        incorrect: total - correct,
        accuracy: Math.round(accuracy),
        avgTimeSeconds: Math.round(avgTime),
        recentResponses: data?.slice(0, 5) || []
      };
    } catch (error) {
      console.error('Error fetching question stats:', error);
      return null;
    }
  };

  return {
    trackQuestionResponse,
    getQuestionStats,
    isTracking
  };
}

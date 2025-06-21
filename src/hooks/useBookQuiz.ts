
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useXPIntegration } from '@/hooks/useXPIntegration';
import { trackSearchAnalytics } from '@/utils/analyticsTracking';

export interface QuizQuestion {
  id: string;
  book_id: string;
  chapter_index: number;
  question_text: string;
  correct_answer: string;
  wrong_answers: string[];
  options: string[];
  difficulty_level: number;
}

export interface QuizSession {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: string[];
  score: number;
  isComplete: boolean;
}

export const useBookQuiz = () => {
  const { user } = useAuth();
  const { awardReadingSessionXP } = useXPIntegration();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async (bookId: string, maxChapterIndex: number, questionCount = 5) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('book-quiz-questions', {
        body: {
          book_id: bookId,
          max_chapter_index: maxChapterIndex,
          question_count: questionCount
        }
      });

      if (error) throw error;

      if (!data.questions || data.questions.length === 0) {
        setError('No quiz questions available for this book yet.');
        return;
      }

      setSession({
        questions: data.questions,
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        isComplete: false
      });

      // Track quiz start
      await trackSearchAnalytics(
        `quiz-${bookId}`,
        'book-quiz',
        data.questions.length,
        'books',
        user.id
      );

    } catch (err) {
      console.error('Error starting quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = (answer: string) => {
    if (!session || session.isComplete) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    
    const newAnswers = [...session.answers, answer];
    const newScore = isCorrect ? session.score + 1 : session.score;
    const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

    setSession({
      ...session,
      answers: newAnswers,
      score: newScore,
      currentQuestionIndex: isLastQuestion ? session.currentQuestionIndex : session.currentQuestionIndex + 1,
      isComplete: isLastQuestion
    });

    return { isCorrect, currentScore: newScore };
  };

  const completeQuiz = async () => {
    if (!session || !user?.id || !session.isComplete) return;

    try {
      const scorePercentage = (session.score / session.questions.length) * 100;
      const xpAmount = Math.floor(session.score * 10); // 10 XP per correct answer

      // Save quiz session to database
      const { error } = await supabase
        .from('book_quiz_sessions')
        .insert({
          user_id: user.id,
          book_id: session.questions[0].book_id,
          questions_answered: session.questions.length,
          correct_answers: session.score,
          max_chapter_index: Math.max(...session.questions.map(q => q.chapter_index)),
          session_score: scorePercentage,
          xp_awarded: xpAmount
        });

      if (error) throw error;

      // Award XP for quiz completion
      if (xpAmount > 0) {
        await awardReadingSessionXP(300, 1); // 5 minute reading session equivalent
      }

      return {
        score: session.score,
        totalQuestions: session.questions.length,
        percentage: scorePercentage,
        xpAwarded: xpAmount
      };

    } catch (err) {
      console.error('Error completing quiz:', err);
      throw err;
    }
  };

  const resetQuiz = () => {
    setSession(null);
    setError(null);
  };

  return {
    session,
    loading,
    error,
    startQuiz,
    submitAnswer,
    completeQuiz,
    resetQuiz
  };
};


import { useState, useCallback } from 'react';
import { useFlashcards } from './useFlashcards';
import { useXPIntegration } from './useXPIntegration';
import { useToast } from '@/hooks/use-toast';

export interface QuizCard {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  difficulty: number;
  timesIncorrect?: number;
}

export interface QuizSessionState {
  isActive: boolean;
  currentCardIndex: number;
  cards: QuizCard[];
  userAnswers: Array<{
    cardId: string;
    userChoice: string;
    correct: boolean;
    attempts: number;
  }>;
  sessionStartTime: number;
}

export const useQuizSession = () => {
  const [sessionState, setSessionState] = useState<QuizSessionState>({
    isActive: false,
    currentCardIndex: 0,
    cards: [],
    userAnswers: [],
    sessionStartTime: 0
  });

  const { flashcards } = useFlashcards();
  const { awardFlashcardStudyXP } = useXPIntegration();
  const { toast } = useToast();

  const startQuizSession = useCallback(async (topic?: string, limit: number = 5) => {
    console.log('🎯 Starting quiz session:', { topic, limit });
    
    if (!flashcards || flashcards.length === 0) {
      toast({
        title: "No flashcards found",
        description: "Create some flashcards first to start a quiz session!",
        variant: "destructive"
      });
      return 0;
    }

    // Filter and prioritize struggling cards
    let cardsToQuiz = flashcards.filter(card => {
      const accuracy = card.times_reviewed > 0 
        ? (card.times_correct / card.times_reviewed) * 100 
        : 0;
      
      // Prioritize cards with low accuracy or high difficulty
      return accuracy < 70 || card.difficulty_level >= 3;
    });

    // If we need more cards, add some regular ones
    if (cardsToQuiz.length < limit) {
      const additionalCards = flashcards.filter(card => 
        !cardsToQuiz.includes(card)
      ).slice(0, limit - cardsToQuiz.length);
      cardsToQuiz = [...cardsToQuiz, ...additionalCards];
    }

    // Take only the requested limit
    cardsToQuiz = cardsToQuiz.slice(0, limit);

    // Convert to quiz format with multiple choice
    const quizCards: QuizCard[] = cardsToQuiz.map(card => {
      const options = generateMultipleChoiceOptions(card.back_content, flashcards);
      return {
        id: card.id,
        question: card.front_content,
        correctAnswer: card.back_content,
        options: options.choices,
        correctOption: options.correctOption,
        explanation: `The correct answer is: ${card.back_content}`,
        difficulty: card.difficulty_level || 1,
        timesIncorrect: (card.times_reviewed || 0) - (card.times_correct || 0)
      };
    });

    setSessionState({
      isActive: true,
      currentCardIndex: 0,
      cards: quizCards,
      userAnswers: [],
      sessionStartTime: Date.now()
    });

    toast({
      title: "🎯 Quiz Session Started!",
      description: `Ready to practice with ${quizCards.length} cards. Let's boost your knowledge!`
    });

    return quizCards.length;
  }, [flashcards, toast]);

  const submitAnswer = useCallback(async (userChoice: 'A' | 'B' | 'C' | 'D') => {
    if (!sessionState.isActive || sessionState.currentCardIndex >= sessionState.cards.length) {
      return null;
    }

    const currentCard = sessionState.cards[sessionState.currentCardIndex];
    const correct = userChoice === currentCard.correctOption;
    
    // Check if this is a retry for the same card
    const existingAnswer = sessionState.userAnswers.find(a => a.cardId === currentCard.id);
    const attempts = existingAnswer ? existingAnswer.attempts + 1 : 1;

    const answerRecord = {
      cardId: currentCard.id,
      userChoice,
      correct,
      attempts
    };

    // Update or add the answer
    const updatedAnswers = existingAnswer
      ? sessionState.userAnswers.map(a => a.cardId === currentCard.id ? answerRecord : a)
      : [...sessionState.userAnswers, answerRecord];

    setSessionState(prev => ({
      ...prev,
      userAnswers: updatedAnswers
    }));

    // Award XP for correct answers
    if (correct && attempts === 1) {
      // Full XP for first try
      await awardFlashcardStudyXP(1, 1, 30);
    } else if (correct && attempts > 1) {
      // Partial XP for eventual success
      await awardFlashcardStudyXP(1, 2, 30);
    }

    return {
      correct,
      attempts,
      explanation: currentCard.explanation,
      correctAnswer: currentCard.correctAnswer
    };
  }, [sessionState, awardFlashcardStudyXP]);

  const nextCard = useCallback(() => {
    setSessionState(prev => ({
      ...prev,
      currentCardIndex: prev.currentCardIndex + 1
    }));
  }, []);

  const endSession = useCallback(async () => {
    const correctOnFirstTry = sessionState.userAnswers.filter(a => a.correct && a.attempts === 1).length;
    const totalCorrect = sessionState.userAnswers.filter(a => a.correct).length;
    const sessionDuration = Math.floor((Date.now() - sessionState.sessionStartTime) / 1000);

    // Award bonus XP for session completion
    if (totalCorrect > 0) {
      await awardFlashcardStudyXP(totalCorrect, sessionState.cards.length, sessionDuration);
    }

    const results = {
      totalCards: sessionState.cards.length,
      correctOnFirstTry,
      totalCorrect,
      sessionDuration,
      accuracy: Math.round((totalCorrect / sessionState.cards.length) * 100)
    };

    setSessionState({
      isActive: false,
      currentCardIndex: 0,
      cards: [],
      userAnswers: [],
      sessionStartTime: 0
    });

    toast({
      title: "🎉 Quiz Session Complete!",
      description: `${correctOnFirstTry}/${sessionState.cards.length} correct on first try. Well done!`
    });

    return results;
  }, [sessionState, awardFlashcardStudyXP, toast]);

  const getCurrentCard = useCallback(() => {
    if (!sessionState.isActive || sessionState.currentCardIndex >= sessionState.cards.length) {
      return null;
    }
    return sessionState.cards[sessionState.currentCardIndex];
  }, [sessionState]);

  const isSessionComplete = sessionState.currentCardIndex >= sessionState.cards.length;

  return {
    sessionState,
    startQuizSession,
    submitAnswer,
    nextCard,
    endSession,
    getCurrentCard,
    isSessionComplete,
    progress: {
      current: sessionState.currentCardIndex + 1,
      total: sessionState.cards.length,
      percentage: sessionState.cards.length > 0 
        ? Math.round(((sessionState.currentCardIndex + 1) / sessionState.cards.length) * 100)
        : 0
    }
  };
};

// Enhanced helper function to generate better multiple choice options
function generateMultipleChoiceOptions(correctAnswer: string, allFlashcards: any[]): {
  choices: string[];
  correctOption: 'A' | 'B' | 'C' | 'D';
} {
  // Try to use other flashcard answers as distractors for more realistic options
  const otherAnswers = allFlashcards
    ?.map(card => card.back_content)
    .filter(answer => answer !== correctAnswer && answer.length < 100)
    .slice(0, 5) || [];

  // Fallback distractors if we don't have enough from other cards
  const fallbackDistractors = [
    "Increases soil acidity levels",
    "Reduces atmospheric oxygen",
    "Improves water retention capacity",
    "Decreases overall plant diversity",
    "Enhances carbon storage potential",
    "Reduces nutrient availability",
    "Improves ecosystem stability",
    "Increases thermal regulation"
  ];

  // Combine real answers with fallbacks and select 3 distractors
  const allDistractors = [...otherAnswers, ...fallbackDistractors]
    .filter(d => d !== correctAnswer)
    .slice(0, 6)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const allOptions = [correctAnswer, ...allDistractors];
  const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

  const correctIndex = shuffledOptions.indexOf(correctAnswer);
  const correctOption = ['A', 'B', 'C', 'D'][correctIndex] as 'A' | 'B' | 'C' | 'D';

  return {
    choices: shuffledOptions,
    correctOption
  };
}

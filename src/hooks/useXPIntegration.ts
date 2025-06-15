
import { useCallback } from 'react';
import { useGamification } from './useGamification';

export function useXPIntegration() {
  const { awardXP, updateStreak } = useGamification();

  // Flashcard Events
  const awardFlashcardCreationXP = useCallback(async () => {
    await awardXP('flashcard_created', 5, {
      description: 'Created a new flashcard'
    });
  }, [awardXP]);

  const awardFlashcardStudyXP = useCallback(async (correctAnswers: number, totalCards: number, sessionDuration: number) => {
    const baseXP = Math.floor(correctAnswers / 10) * 5; // 5 XP per 10 correct answers
    const accuracyBonus = correctAnswers === totalCards ? 10 : 0; // Perfect score bonus
    const speedBonus = sessionDuration < 300 ? 5 : 0; // Under 5 minutes bonus
    
    await awardXP('flashcard_study', baseXP + accuracyBonus + speedBonus, {
      correct_answers: correctAnswers,
      total_cards: totalCards,
      duration_seconds: sessionDuration,
      description: `Completed flashcard study session`
    });

    // Update study streak
    await updateStreak('study');
  }, [awardXP, updateStreak]);

  // Quizlet Import Events
  const awardFlashcardImportXP = useCallback(async (termCount: number) => {
    const baseXP = Math.min(50, termCount * 2); // 2 XP per term, max 50 XP
    
    await awardXP('flashcard_import', baseXP, {
      term_count: termCount,
      description: `Imported ${termCount} flashcards from Quizlet`
    });
  }, [awardXP]);

  // Module Events
  const awardModuleCompletionXP = useCallback(async (moduleId: string) => {
    await awardXP('module_completed', 50, {
      module_id: moduleId,
      description: 'Completed a learning module'
    });
  }, [awardXP]);

  // Reading Events
  const awardReadingSessionXP = useCallback(async (durationSeconds: number, pagesRead: number) => {
    const timeXP = Math.floor(durationSeconds / 600) * 5; // 5 XP per 10 minutes
    const pageXP = pagesRead * 2; // 2 XP per page
    
    await awardXP('reading_session', timeXP + pageXP, {
      duration_seconds: durationSeconds,
      pages_read: pagesRead,
      description: 'Completed reading session'
    });

    // Update reading streak
    await updateStreak('reading');
  }, [awardXP, updateStreak]);

  // Note Events
  const awardNoteCreationXP = useCallback(async () => {
    await awardXP('note_created', 10, {
      description: 'Created a new note'
    });
  }, [awardXP]);

  // File Upload Events
  const awardFileUploadXP = useCallback(async () => {
    await awardXP('file_uploaded', 15, {
      description: 'Uploaded a study file'
    });
  }, [awardXP]);

  // Book Upload Events
  const awardBookUploadApprovalXP = useCallback(async () => {
    await awardXP('book_upload_approved', 100, {
      description: 'Your uploaded book was approved for the community'
    });
  }, [awardXP]);

  // Login Events
  const awardDailyLoginXP = useCallback(async () => {
    await updateStreak('login');
    await awardXP('daily_login', 5, {
      description: 'Daily login bonus'
    });
  }, [awardXP, updateStreak]);

  // Challenge Events
  const awardChallengeCompletionXP = useCallback(async (challengeType: string, score: number) => {
    const baseXP = 25;
    const performanceBonus = Math.floor(score / 10) * 5; // Bonus based on score
    
    await awardXP('challenge_completed', baseXP + performanceBonus, {
      challenge_type: challengeType,
      score: score,
      description: `Completed ${challengeType} challenge`
    });
  }, [awardXP]);

  // Goal Events
  const awardGoalCompletionXP = useCallback(async (goalType: string, priority: string) => {
    let xpValue = 30; // Base XP for goal completion
    
    // Bonus based on priority
    switch (priority) {
      case 'high':
        xpValue += 20;
        break;
      case 'medium':
        xpValue += 10;
        break;
      case 'low':
        xpValue += 5;
        break;
    }
    
    await awardXP('goal_completed', xpValue, {
      goal_type: goalType,
      priority: priority,
      description: `Completed a ${priority} priority goal`
    });
  }, [awardXP]);

  return {
    awardFlashcardCreationXP,
    awardFlashcardStudyXP,
    awardFlashcardImportXP,
    awardModuleCompletionXP,
    awardReadingSessionXP,
    awardNoteCreationXP,
    awardFileUploadXP,
    awardBookUploadApprovalXP,
    awardDailyLoginXP,
    awardChallengeCompletionXP,
    awardGoalCompletionXP
  };
}

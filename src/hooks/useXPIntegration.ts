
import { useCallback } from 'react';
import { useGamification } from './useGamification';
import { useNotificationTriggers } from './useNotificationTriggers';

export function useXPIntegration() {
  const { awardXP, updateStreak } = useGamification();
  const { triggerAchievement, triggerStudyStreak } = useNotificationTriggers();

  // Flashcard Events
  const awardFlashcardCreationXP = useCallback(async () => {
    const result = await awardXP('flashcard_created', 5, {
      description: 'Created a new flashcard'
    });
    
    // Check for achievements and trigger notifications
    if (result?.level && result.level > 1) {
      await triggerAchievement(`Level ${result.level} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

  const awardFlashcardStudyXP = useCallback(async (correctAnswers: number, totalCards: number, sessionDuration: number) => {
    const baseXP = Math.floor(correctAnswers / 10) * 5; // 5 XP per 10 correct answers
    const accuracyBonus = correctAnswers === totalCards ? 10 : 0; // Perfect score bonus
    const speedBonus = sessionDuration < 300 ? 5 : 0; // Under 5 minutes bonus
    
    const result = await awardXP('flashcard_study', baseXP + accuracyBonus + speedBonus, {
      correct_answers: correctAnswers,
      total_cards: totalCards,
      duration_seconds: sessionDuration,
      description: `Completed flashcard study session`
    });

    // Update study streak and potentially trigger notification
    const streakResult = await updateStreak('study');
    if (streakResult?.streak && streakResult.streak > 1) {
      await triggerStudyStreak(streakResult.streak);
    }

    // Check for level up
    if (result?.level && result.level > 1) {
      await triggerAchievement(`Level ${result.level} Reached!`);
    }
  }, [awardXP, updateStreak, triggerAchievement, triggerStudyStreak]);

  // Note Events
  const awardNoteCreationXP = useCallback(async () => {
    const result = await awardXP('note_created', 10, {
      description: 'Created a new note'
    });
    
    if (result?.level && result.level > 1) {
      await triggerAchievement(`Level ${result.level} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

  // File Upload Events
  const awardFileUploadXP = useCallback(async () => {
    const result = await awardXP('file_uploaded', 15, {
      description: 'Uploaded a study file'
    });
    
    if (result?.level && result.level > 1) {
      await triggerAchievement(`Level ${result.level} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

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
    
    const result = await awardXP('goal_completed', xpValue, {
      goal_type: goalType,
      priority: priority,
      description: `Completed a ${priority} priority goal`
    });

    if (result?.level && result.level > 1) {
      await triggerAchievement(`Level ${result.level} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

  // Reading Session Events
  const awardReadingSessionXP = useCallback(async (durationSeconds: number, pagesRead: number) => {
    const baseXP = Math.floor(durationSeconds / 60) * 2; // 2 XP per minute
    const pageBonus = pagesRead * 5; // 5 XP per page
    
    const result = await awardXP('reading_session', baseXP + pageBonus, {
      duration_seconds: durationSeconds,
      pages_read: pagesRead,
      description: 'Completed reading session'
    });

    if (result?.level && result.level > 1) {
      await triggerAchievement(`Level ${result.level} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

  // Module Completion Events
  const awardModuleCompletionXP = useCallback(async (moduleId: string) => {
    const result = await awardXP('module_completed', 50, {
      module_id: moduleId,
      description: 'Completed a learning module'
    });

    if (result?.level && result.level > 1) {
      await triggerAchievement(`Level ${result.level} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

  // Challenge Completion Events
  const awardChallengeCompletionXP = useCallback(async (challengeType: string, xpAmount: number) => {
    const result = await awardXP('challenge_completed', xpAmount, {
      challenge_type: challengeType,
      description: `Completed ${challengeType} challenge`
    });

    if (result?.level && result.level > 1) {
      await triggerAchievement(`Level ${result.level} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

  return {
    awardFlashcardCreationXP,
    awardFlashcardStudyXP,
    awardNoteCreationXP,
    awardFileUploadXP,
    awardGoalCompletionXP,
    awardReadingSessionXP,
    awardModuleCompletionXP,
    awardChallengeCompletionXP
  };
}

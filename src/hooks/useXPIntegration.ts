
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
    if (result?.newLevel) {
      await triggerAchievement(`Level ${result.newLevel} Reached!`);
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
    if (result?.newLevel) {
      await triggerAchievement(`Level ${result.newLevel} Reached!`);
    }
  }, [awardXP, updateStreak, triggerAchievement, triggerStudyStreak]);

  // Note Events
  const awardNoteCreationXP = useCallback(async () => {
    const result = await awardXP('note_created', 10, {
      description: 'Created a new note'
    });
    
    if (result?.newLevel) {
      await triggerAchievement(`Level ${result.newLevel} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

  // File Upload Events
  const awardFileUploadXP = useCallback(async () => {
    const result = await awardXP('file_uploaded', 15, {
      description: 'Uploaded a study file'
    });
    
    if (result?.newLevel) {
      await triggerAchievement(`Level ${result.newLevel} Reached!`);
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

    if (result?.newLevel) {
      await triggerAchievement(`Level ${result.newLevel} Reached!`);
    }
  }, [awardXP, triggerAchievement]);

  return {
    awardFlashcardCreationXP,
    awardFlashcardStudyXP,
    awardNoteCreationXP,
    awardFileUploadXP,
    awardGoalCompletionXP
  };
}

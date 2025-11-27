
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { useXPIntegration } from './useXPIntegration';

export function useXPSystem() {
  const [isAwarding, setIsAwarding] = useState(false);
  const { user } = useAuth();
  const {
    awardFlashcardCreationXP,
    awardFlashcardStudyXP,
    awardModuleCompletionXP,
    awardReadingSessionXP,
    awardNoteCreationXP,
    awardFileUploadXP,
    awardGoalCompletionXP
  } = useXPIntegration();

  const awardXP = useCallback(async (amount: number, reason: string) => {
    if (!user?.id || isAwarding) return;

    setIsAwarding(true);
    try {
      // Use the new gamification system for basic XP awarding
      await awardFlashcardStudyXP(amount, amount, 60); // Default values for compatibility
      
      console.log(`XP awarded: +${amount} for ${reason}`);
    } catch (error) {
      console.error('Failed to award XP:', error);
    } finally {
      setIsAwarding(false);
    }
  }, [user?.id, isAwarding, awardFlashcardStudyXP]);

  const calculateModuleXP = useCallback((moduleId: string) => {
    // Base XP for completing a module
    const baseXP = 50;
    // Bonus XP for early modules (encourages starting)
    const moduleNumber = parseInt(moduleId.replace('module-', ''));
    const bonusXP = Math.max(0, 20 - moduleNumber * 2);
    return baseXP + bonusXP;
  }, []);

  const calculateProgressXP = useCallback((percentage: number) => {
    // Award XP for major milestones
    if (percentage >= 100) return 100; // Course completion bonus
    if (percentage >= 75) return 25;
    if (percentage >= 50) return 15;
    if (percentage >= 25) return 10;
    return 0;
  }, []);

  return {
    awardXP,
    calculateModuleXP,
    calculateProgressXP,
    isAwarding,
    // Expose specific XP functions for direct use
    awardFlashcardCreationXP,
    awardFlashcardStudyXP,
    awardModuleCompletionXP,
    awardReadingSessionXP,
    awardNoteCreationXP,
    awardFileUploadXP,
    awardGoalCompletionXP
  };
}

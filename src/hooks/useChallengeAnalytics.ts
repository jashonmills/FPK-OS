
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useXPIntegration } from '@/hooks/useXPIntegration';
import { toast } from '@/components/ui/use-toast';

interface ChallengeStartEvent {
  challengeType: 'quick_review' | 'accuracy_challenge' | 'speed_test' | 'custom_practice';
  mode: 'random' | 'custom';
  cardCount: number;
  timestamp: string;
}

interface ChallengeCompleteEvent extends ChallengeStartEvent {
  correctCount: number;
  timeTakenSec: number;
}

interface XPAwardedEvent {
  challengeType: string;
  xpAmount: number;
  reason: string;
  timestamp: string;
}

export function useChallengeAnalytics() {
  const { user } = useAuth();
  const { awardChallengeCompletionXP } = useXPIntegration();

  const trackChallengeStart = useCallback(async (
    challengeType: ChallengeStartEvent['challengeType'],
    mode: 'random' | 'custom',
    cardCount: number
  ) => {
    if (!user?.id) return;

    const event: ChallengeStartEvent = {
      challengeType,
      mode,
      cardCount,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Challenge Started:', event);

    // TODO: Send to analytics pipeline (Supabase edge function)
    // For now, we'll log the event and could extend this to send to our analytics system
    try {
      // This could be extended to send to a dedicated analytics edge function
      console.log('Analytics Event - challenge_start:', event);
    } catch (error) {
      console.error('Failed to track challenge start:', error);
    }
  }, [user?.id]);

  const trackChallengeComplete = useCallback(async (
    challengeType: ChallengeCompleteEvent['challengeType'],
    mode: 'random' | 'custom',
    cardCount: number,
    correctCount: number,
    timeTakenSec: number,
    startTime?: number
  ) => {
    if (!user?.id) return;

    const actualTimeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : timeTakenSec;

    const event: ChallengeCompleteEvent = {
      challengeType,
      mode,
      cardCount,
      correctCount,
      timeTakenSec: actualTimeTaken,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Challenge Completed:', event);

    // Calculate XP based on challenge type and performance
    const xpAmount = calculateChallengeXP(challengeType, cardCount, correctCount, actualTimeTaken);
    
    try {
      // Award XP through existing system
      await awardChallengeCompletionXP(challengeType, xpAmount);

      // Track XP awarded event
      const xpEvent: XPAwardedEvent = {
        challengeType,
        xpAmount,
        reason: `Completed ${challengeType.replace('_', ' ')} challenge`,
        timestamp: new Date().toISOString()
      };

      console.log('📊 XP Awarded:', xpEvent);

      // Show success toast to user
      toast({
        title: `🎉 Challenge Complete!`,
        description: `You earned ${xpAmount} XP for completing the ${challengeType.replace('_', ' ')} challenge!`,
        duration: 4000,
      });

      // Track completion event
      console.log('Analytics Event - challenge_complete:', event);
      console.log('Analytics Event - xp_awarded:', xpEvent);

    } catch (error) {
      console.error('Failed to award XP for challenge completion:', error);
      toast({
        title: "Challenge Complete",
        description: "Challenge completed successfully!",
        duration: 3000,
      });
    }
  }, [user?.id, awardChallengeCompletionXP]);

  return {
    trackChallengeStart,
    trackChallengeComplete
  };
}

function calculateChallengeXP(
  challengeType: string,
  cardCount: number,
  correctCount: number,
  timeTakenSec: number
): number {
  switch (challengeType) {
    case 'quick_review':
      // +10 XP per card reviewed
      return cardCount * 10;
      
    case 'accuracy_challenge':
      // +20 XP if ≥80% correct, else +5 XP per correct
      const accuracy = cardCount > 0 ? (correctCount / cardCount) * 100 : 0;
      if (accuracy >= 80) {
        return 20 * cardCount;
      } else {
        return Math.max(correctCount * 5, 10); // Minimum 10 XP for attempting
      }
      
    case 'speed_test':
      // +15 XP per card answered within time limit, bonus +50 XP for 100%
      let speedXP = correctCount * 15;
      if (correctCount === cardCount && cardCount > 0) {
        speedXP += 50; // Perfect score bonus
      }
      return Math.max(speedXP, 10);
      
    case 'custom_practice':
      // +10 XP per card, +10 XP bonus for custom selection effort
      return (cardCount * 10) + 10;
      
    default:
      return Math.max(cardCount * 5, 10); // Fallback
  }
}

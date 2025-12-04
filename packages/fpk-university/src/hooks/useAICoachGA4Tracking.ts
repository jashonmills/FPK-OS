import { useCallback } from 'react';
import { ga4 } from '@/utils/ga4Setup';
import { useAuth } from '@/hooks/useAuth';

export const useAICoachGA4Tracking = () => {
  const { user } = useAuth();

  const trackChatSessionStarted = useCallback((sessionType: 'socratic' | 'free_chat', topic?: string) => {
    ga4.trackCustomEvent('ai_chat_session_started', {
      user_id: user?.id,
      session_type: sessionType,
      topic: topic,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackChatMessageSent = useCallback((sessionId: string, messageLength: number) => {
    ga4.trackCustomEvent('ai_chat_message_sent', {
      user_id: user?.id,
      session_id: sessionId,
      message_length: messageLength,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackSocraticTurnCompleted = useCallback((sessionId: string, turnNumber: number, score?: number) => {
    ga4.trackCustomEvent('socratic_turn_completed', {
      user_id: user?.id,
      session_id: sessionId,
      turn_number: turnNumber,
      score: score,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackChatSessionEnded = useCallback((sessionId: string, duration: number, turnCount: number) => {
    ga4.trackCustomEvent('ai_chat_session_ended', {
      user_id: user?.id,
      session_id: sessionId,
      duration_seconds: duration,
      turn_count: turnCount,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackPhoenixFeatureUsed = useCallback((featureName: string, context?: string) => {
    ga4.trackCustomEvent('phoenix_feature_used', {
      user_id: user?.id,
      feature_name: featureName,
      context: context,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  const trackAICreditsUsed = useCallback((amount: number, transactionType: string) => {
    ga4.trackCustomEvent('ai_credits_used', {
      user_id: user?.id,
      amount: amount,
      transaction_type: transactionType,
      timestamp: new Date().toISOString()
    });
  }, [user?.id]);

  return {
    trackChatSessionStarted,
    trackChatMessageSent,
    trackSocraticTurnCompleted,
    trackChatSessionEnded,
    trackPhoenixFeatureUsed,
    trackAICreditsUsed
  };
};

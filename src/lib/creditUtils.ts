import { supabase } from '@/integrations/supabase/client';

interface ConsumeCreditsResult {
  success: boolean;
  error?: string;
  credits_consumed?: number;
  total_remaining?: number;
}

export const consumeCredits = async (
  familyId: string,
  actionType: string,
  creditsRequired: number,
  metadata: Record<string, any> = {}
): Promise<ConsumeCreditsResult> => {
  try {
    const { data, error } = await supabase.rpc('consume_ai_credits', {
      p_family_id: familyId,
      p_action_type: actionType,
      p_credits_required: creditsRequired,
      p_metadata: metadata,
    });

    if (error) throw error;

    // Parse the result safely by casting through unknown
    if (typeof data === 'object' && data !== null && 'success' in data) {
      return data as unknown as ConsumeCreditsResult;
    }

    return {
      success: false,
      error: 'Invalid response format',
    };
  } catch (error) {
    console.error('Error consuming credits:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to consume credits',
    };
  }
};

export const calculateTextToSpeechCredits = (text: string): number => {
  // 1 credit per 1,000 characters
  return Math.ceil(text.length / 1000);
};

export const calculateSpeechToTextCredits = (durationSeconds: number): number => {
  // 1 credit per 30 seconds
  return Math.ceil(durationSeconds / 30);
};

export const getChatCredits = (isRAG: boolean): number => {
  // Simple chat: 10 credits, RAG chat: 35 credits
  return isRAG ? 35 : 10;
};

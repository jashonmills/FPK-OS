import { supabase } from '@/integrations/supabase/client';
import type { Message, OrchestratorRequest, OrchestratorResponse } from '@/types/aiCoach';

/**
 * AI Service - Handles communication with the AI Coach Orchestrator Edge Function
 */

export class AIService {
  /**
   * Send a message to the AI orchestrator and get a response
   */
  static async sendMessage(
    userId: string,
    message: string,
    conversationHistory: Message[],
    conversationId?: string
  ): Promise<OrchestratorResponse> {
    try {
      // Format conversation history to match existing orchestrator format
      const formattedHistory = conversationHistory.map(msg => ({
        persona: msg.persona,
        content: msg.content,
      }));

      // Use existing conversation ID or create a new one
      const convId = conversationId || `conv_${Date.now()}_${userId.substring(0, 8)}`;

      const request = {
        message,
        conversationId: convId,
        conversationHistory: formattedHistory,
      };

      const { data, error } = await supabase.functions.invoke('ai-coach-orchestrator', {
        body: request,
      });

      if (error) {
        throw new Error(`AI Orchestrator Error: ${error.message}`);
      }

      // Transform response to match expected format
      return {
        persona: (data.persona || 'BETTY').toUpperCase() as 'USER' | 'BETTY' | 'AL' | 'NITE_OWL',
        content: data.message || data.response || '',
        creditsUsed: data.tokensUsed || data.tokens_used || 0,
        remainingCredits: data.remainingCredits || 0,
      };
    } catch (error) {
      console.error('Error calling AI service:', error);
      throw error;
    }
  }

  /**
   * INTEGRATION SOCKET: Analytics Data
   * 
   * Fetch user analytics from the database
   * This is a placeholder that returns sample data.
   * 
   * To integrate with production:
   * 1. Replace with actual Supabase query to user_analytics table
   * 2. Ensure RLS policies allow user to read their own analytics
   */
  static async fetchUserAnalytics(userId: string) {
    // TODO: Implement when ai_coach_analytics table is created
    // Placeholder data for now
    return {
      totalStudyTime: 0,
      sessionsCompleted: 0,
      topicsStudied: [],
      averageScore: 0,
      streakDays: 0,
    };
  }

  /**
   * INTEGRATION SOCKET: Saved Chats
   * 
   * Fetch user's saved conversations from the database
   * This is a placeholder that returns sample data.
   * 
   * To integrate with production:
   * 1. Replace with actual Supabase query to conversations table
   * 2. Include message count and last message preview
   * 3. Order by updated_at DESC
   */
  static async fetchSavedChats(userId: string) {
    // TODO: Implement when ai_coach_conversations table is created
    // Placeholder data for now
    return [];
  }

  /**
   * Load a specific conversation with all its messages
   */
  static async loadConversation(conversationId: string) {
    // Placeholder implementation
    return [];

    // Production implementation (commented out):
    /*
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(msg => ({
      id: msg.id,
      persona: msg.persona,
      content: msg.content,
      timestamp: new Date(msg.created_at),
    }));
    */
  }

  /**
   * Save a conversation to the database
   */
  static async saveConversation(
    userId: string,
    title: string,
    messages: Message[]
  ) {
    // Placeholder implementation
    console.log('Saving conversation:', title, messages.length, 'messages');

    // Production implementation (commented out):
    /*
    // Create conversation record
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        message_count: messages.length,
      })
      .select()
      .single();

    if (convError) throw convError;

    // Insert all messages
    const messageRecords = messages.map(msg => ({
      conversation_id: conversation.id,
      persona: msg.persona,
      content: msg.content,
      created_at: msg.timestamp,
    }));

    const { error: msgError } = await supabase
      .from('messages')
      .insert(messageRecords);

    if (msgError) throw msgError;

    return conversation.id;
    */
  }

  /**
   * Fetch study materials for a user
   */
  static async fetchStudyMaterials(userId: string) {
    // TODO: Implement when ai_coach_study_materials table is created
    // Placeholder data for now
    return [];
  }

  /**
   * Fetch active study plan for a user
   */
  static async fetchStudyPlan(userId: string) {
    // TODO: Implement when ai_coach_study_plans table is created
    // Placeholder data for now
    return null;
  }

  /**
   * Fetch AI-generated drills for a user
   */
  static async fetchDrills(userId: string, limit: number = 5) {
    // Placeholder implementation
    return [
      {
        id: '1',
        question: 'What are the main stages of mitosis?',
        type: 'short-answer' as const,
        difficulty: 'medium' as const,
        topic: 'Cell Division',
      },
      {
        id: '2',
        question: 'True or False: Chloroplasts are found in animal cells.',
        type: 'true-false' as const,
        difficulty: 'easy' as const,
        topic: 'Cell Structure',
      },
    ];

    // Production implementation (commented out):
    /*
    const { data, error } = await supabase
      .from('ai_drills')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(drill => ({
      id: drill.id,
      question: drill.question,
      type: drill.drill_type,
      difficulty: drill.difficulty,
      topic: drill.topic,
    }));
    */
  }

  /**
   * Get user's credit balance
   */
  static async getCreditBalance(userId: string) {
    // Placeholder implementation
    return { balance: 100, role: 'user' };

    // Production implementation (commented out):
    /*
    const { data, error } = await supabase
      .from('user_credits')
      .select('balance, role')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return {
      balance: data.balance,
      role: data.role,
    };
    */
  }
}

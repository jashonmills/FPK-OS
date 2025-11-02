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
        persona: data.persona || 'betty',
        message: data.message || data.response || '',
        tokensUsed: data.tokensUsed || data.tokens_used || 0,
        cost: data.cost || 0,
      } as OrchestratorResponse;
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
    try {
      // Query the ai_coach_analytics table
      const { data, error } = await supabase
        .from('ai_coach_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('session_date', { ascending: false })
        .limit(30); // Last 30 sessions

      if (error) {
        console.warn('Analytics query error, using defaults:', error);
        // Return default values if no data yet
        return {
          totalStudyTime: 0,
          sessionsCompleted: 0,
          topicsStudied: [],
          averageScore: 0,
          streakDays: 0,
        };
      }

      if (!data || data.length === 0) {
        return {
          totalStudyTime: 0,
          sessionsCompleted: 0,
          topicsStudied: [],
          averageScore: 0,
          streakDays: 0,
        };
      }

      // Aggregate the analytics data
      const totalStudyTime = data.reduce((sum, session) => sum + (session.study_time_minutes || 0), 0) / 60;
      const sessionsCompleted = data.length;
      const topicsStudied = [...new Set(data.flatMap(session => session.topics_explored || []))];
      const averageScore = data.reduce((sum, session) => sum + (session.comprehension_score || 0), 0) / data.length;
      
      // Calculate streak
      let streakDays = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const sortedDates = data
        .map(s => new Date(s.session_date))
        .sort((a, b) => b.getTime() - a.getTime());
      
      for (let i = 0; i < sortedDates.length; i++) {
        const sessionDate = new Date(sortedDates[i]);
        sessionDate.setHours(0, 0, 0, 0);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (sessionDate.getTime() === expectedDate.getTime()) {
          streakDays++;
        } else {
          break;
        }
      }

      return {
        totalStudyTime: Math.round(totalStudyTime),
        sessionsCompleted,
        topicsStudied,
        averageScore: Math.round(averageScore),
        streakDays,
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        totalStudyTime: 0,
        sessionsCompleted: 0,
        topicsStudied: [],
        averageScore: 0,
        streakDays: 0,
      };
    }
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
    try {
      // Query ai_coach_conversations with message count
      const { data, error } = await supabase
        .from('ai_coach_conversations')
        .select('id, title, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Saved chats query error:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // For each conversation, get the message count and last message
      const chatsWithDetails = await Promise.all(
        data.map(async (conv) => {
          const { data: messages, error: msgError } = await supabase
            .from('ai_coach_messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const { count } = await supabase
            .from('ai_coach_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);

          return {
            id: conv.id,
            title: conv.title,
            lastMessage: messages?.[0]?.content || 'No messages yet',
            timestamp: new Date(conv.updated_at),
            messageCount: count || 0,
          };
        })
      );

      return chatsWithDetails;
    } catch (error) {
      console.error('Error fetching saved chats:', error);
      return [];
    }
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
    try {
      const { data, error } = await supabase
        .from('ai_coach_study_materials')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Study materials query error:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(material => ({
        id: material.id,
        title: material.title,
        type: material.file_type,
        uploadedAt: new Date(material.created_at),
        size: material.file_size,
      }));
    } catch (error) {
      console.error('Error fetching study materials:', error);
      return [];
    }
  }

  /**
   * Fetch active study plan for a user
   */
  static async fetchStudyPlan(userId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_coach_study_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No active plan
        console.warn('Study plan query error:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        topics: data.topics,
        estimatedTime: data.estimated_hours,
        progress: data.progress_percentage,
      };
    } catch (error) {
      console.error('Error fetching study plan:', error);
      return null;
    }
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

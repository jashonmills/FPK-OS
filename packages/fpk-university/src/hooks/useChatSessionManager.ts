import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface UseChatSessionManagerProps {
  userId?: string;
  messages: ChatMessage[];
  sessionType?: 'free' | 'socratic';
  source?: string;
}

export const useChatSessionManager = ({ 
  userId, 
  messages, 
  sessionType = 'free',
  source = 'coach_portal'
}: UseChatSessionManagerProps) => {
  const { toast } = useToast();

  const generateTitleFromMessages = useCallback((msgs: ChatMessage[]): string => {
    // Find first user message
    const firstUserMsg = msgs.find(m => m.role === 'user');
    if (!firstUserMsg) {
      return 'Untitled Chat';
    }

    // Take first 50 chars and clean up
    const title = firstUserMsg.content
      .substring(0, 50)
      .trim()
      .replace(/\n/g, ' ');

    return title.length < firstUserMsg.content.length 
      ? title + '...' 
      : title;
  }, []);

  const saveCurrentSession = useCallback(async (customTitle?: string): Promise<string | null> => {
    if (!userId) {
      logger.warn('Cannot save session: No user ID', 'CHAT_SESSION');
      return null;
    }

    if (messages.length <= 1) {
      logger.info('No messages to save (only welcome message)', 'CHAT_SESSION');
      return null;
    }

    try {
      const sessionTitle = customTitle || generateTitleFromMessages(messages);
      
      // Prepare session data
      const sessionData = {
        user_id: userId,
        session_title: sessionTitle,
        source,
        session_data: {
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          }))
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      logger.info('💾 Saving chat session', 'CHAT_SESSION', {
        messageCount: messages.length,
        title: sessionTitle
      });

      // Insert into coach_sessions table
      const { data, error } = await supabase
        .from('coach_sessions')
        .insert(sessionData)
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      logger.info('✅ Chat session saved', 'CHAT_SESSION', { sessionId: data.id });
      return data.id;

    } catch (error) {
      logger.error('Failed to save chat session', 'CHAT_SESSION', error);
      toast({
        title: 'Failed to save chat',
        description: 'Could not save your conversation. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  }, [userId, messages, source, generateTitleFromMessages, toast]);

  const autoSaveBeforeNewSession = useCallback(async (): Promise<boolean> => {
    // Check if there are messages to save (exclude welcome message)
    if (messages.length <= 1) {
      logger.info('No messages to auto-save', 'CHAT_SESSION');
      return false;
    }

    logger.info('🔄 Auto-saving current chat before new session', 'CHAT_SESSION');
    const sessionId = await saveCurrentSession();
    
    if (sessionId) {
      toast({
        title: 'Previous chat saved',
        description: 'Your conversation has been saved to history',
        duration: 3000
      });
      return true;
    }

    return false;
  }, [messages, saveCurrentSession, toast]);

  return {
    saveCurrentSession,
    autoSaveBeforeNewSession,
    canSave: messages.length > 1 && !!userId
  };
};

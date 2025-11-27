import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';

export interface PhoenixMessage {
  id: string;
  persona: 'USER' | 'BETTY' | 'AL' | 'NITE_OWL';
  content: string;
  timestamp: string;
  intent?: string;
  sentiment?: string;
}

export const usePhoenixSession = (userId?: string) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PhoenixMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load active session on mount
  useEffect(() => {
    if (userId) {
      loadActiveSession();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const loadActiveSession = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Get most recent conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('phoenix_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (conversationError) throw conversationError;

      if (conversation) {
        // Load messages for this conversation
        const { data: msgs, error: msgsError } = await supabase
          .from('phoenix_messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true });

        if (msgsError) throw msgsError;

        setConversationId(conversation.id);
        setSessionId(conversation.session_id);
        setMessages(msgs?.map(m => ({
          id: m.id,
          persona: m.persona as 'USER' | 'BETTY' | 'AL' | 'NITE_OWL',
          content: m.content,
          timestamp: m.created_at,
          intent: m.intent || undefined,
          sentiment: m.sentiment || undefined,
        })) || []);
        
        logger.info('Loaded active Phoenix session', 'PHOENIX_SESSION', { 
          conversationId: conversation.id, 
          messageCount: msgs?.length 
        });
      } else {
        logger.info('No active Phoenix session found', 'PHOENIX_SESSION');
      }
    } catch (error) {
      logger.error('Failed to load Phoenix session', 'PHOENIX_SESSION', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = useCallback(async (): Promise<string | null> => {
    if (!userId) {
      logger.warn('Cannot start session: No user ID', 'PHOENIX_SESSION');
      return null;
    }

    try {
      const newSessionId = crypto.randomUUID();

      // Create new conversation
      const { data, error } = await supabase
        .from('phoenix_conversations')
        .insert({
          user_id: userId,
          session_id: newSessionId,
          metadata: {},
        })
        .select('id, session_id')
        .single();

      if (error) throw error;

      setConversationId(data.id);
      setSessionId(data.session_id);
      setMessages([]);
      
      logger.info('Started new Phoenix session', 'PHOENIX_SESSION', { 
        conversationId: data.id,
        sessionId: data.session_id 
      });
      
      toast({
        title: 'New chat started',
        duration: 2000
      });

      return data.session_id;
    } catch (error) {
      logger.error('Failed to start new session', 'PHOENIX_SESSION', error);
      toast({
        title: 'Failed to start new chat',
        description: 'Please try again',
        variant: 'destructive'
      });
      return null;
    }
  }, [userId, toast]);

  const ensureSession = useCallback(async (): Promise<{ conversationId: string; sessionId: string } | null> => {
    if (conversationId && sessionId) {
      return { conversationId, sessionId };
    }
    
    // Create initial session if none exists
    if (!userId) return null;
    
    try {
      const newSessionId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('phoenix_conversations')
        .insert({
          user_id: userId,
          session_id: newSessionId,
          metadata: {},
        })
        .select('id, session_id')
        .single();

      if (error) throw error;

      setConversationId(data.id);
      setSessionId(data.session_id);
      logger.info('Created initial Phoenix session', 'PHOENIX_SESSION', { 
        conversationId: data.id,
        sessionId: data.session_id 
      });
      
      return { conversationId: data.id, sessionId: data.session_id };
    } catch (error) {
      logger.error('Failed to ensure session', 'PHOENIX_SESSION', error);
      return null;
    }
  }, [conversationId, sessionId, userId]);

  const saveMessage = useCallback(async (message: Omit<PhoenixMessage, 'id' | 'timestamp'>): Promise<PhoenixMessage | null> => {
    const session = await ensureSession();
    if (!session) return null;

    try {
      // Ensure valid intent and sentiment values
      const validIntent = message.intent && 
        ['frustrated_vent', 'general_chat', 'quick_question', 'socratic_exploration', 'story_request', 'unclear', 'video_assessment'].includes(message.intent)
        ? message.intent
        : 'general_chat';
      
      const validSentiment = message.sentiment || 'neutral';

      const { data, error } = await supabase
        .from('phoenix_messages')
        .insert([{
          conversation_id: session.conversationId,
          persona: message.persona,
          content: message.content,
          intent: validIntent as 'frustrated_vent' | 'general_chat' | 'quick_question' | 'socratic_exploration' | 'story_request' | 'unclear' | 'video_assessment',
          sentiment: validSentiment,
          metadata: {},
        }])
        .select('*')
        .single();

      if (error) throw error;

      const savedMessage: PhoenixMessage = {
        id: data.id,
        persona: data.persona as 'USER' | 'BETTY' | 'AL' | 'NITE_OWL',
        content: data.content,
        timestamp: data.created_at,
        intent: data.intent || undefined,
        sentiment: data.sentiment || undefined,
      };

      setMessages(prev => [...prev, savedMessage]);

      // Update conversation updated_at
      await supabase
        .from('phoenix_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', session.conversationId);

      return savedMessage;
    } catch (error) {
      logger.error('Failed to save message', 'PHOENIX_SESSION', error);
      return null;
    }
  }, [ensureSession]);

  const loadSession = useCallback(async (targetConversationId: string) => {
    try {
      setIsLoading(true);

      // Load selected conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('phoenix_conversations')
        .select('*')
        .eq('id', targetConversationId)
        .single();

      if (conversationError) throw conversationError;

      // Load messages
      const { data: msgs, error: msgsError } = await supabase
        .from('phoenix_messages')
        .select('*')
        .eq('conversation_id', targetConversationId)
        .order('created_at', { ascending: true });

      if (msgsError) throw msgsError;

      setConversationId(conversation.id);
      setSessionId(conversation.session_id);
      setMessages(msgs?.map(m => ({
        id: m.id,
        persona: m.persona as 'USER' | 'BETTY' | 'AL' | 'NITE_OWL',
        content: m.content,
        timestamp: m.created_at,
        intent: m.intent || undefined,
        sentiment: m.sentiment || undefined,
      })) || []);

      logger.info('Loaded Phoenix session', 'PHOENIX_SESSION', { 
        conversationId: targetConversationId, 
        messageCount: msgs?.length 
      });
      
      toast({
        title: 'Chat loaded',
        description: `Resumed conversation with ${msgs?.length || 0} messages`,
        duration: 2000
      });
    } catch (error) {
      logger.error('Failed to load session', 'PHOENIX_SESSION', error);
      toast({
        title: 'Failed to load chat',
        description: 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addMessageToState = useCallback((message: PhoenixMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    sessionId,
    conversationId,
    messages,
    isLoading,
    startNewSession,
    saveMessage,
    loadSession,
    addMessageToState,
    setMessages
  };
};

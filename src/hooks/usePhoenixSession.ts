import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';

export interface PhoenixMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: string;
  audioUrl?: string;
}

export const usePhoenixSession = (userId?: string) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
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
      
      // Get most recent active session
      const { data: session, error: sessionError } = await supabase
        .from('phoenix_conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('last_active_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionError) throw sessionError;

      if (session) {
        // Load messages for this session
        const { data: msgs, error: msgsError } = await supabase
          .from('phoenix_messages')
          .select('*')
          .eq('conversation_id', session.id)
          .order('created_at', { ascending: true });

        if (msgsError) throw msgsError;

        setSessionId(session.id);
        setMessages(msgs?.map(m => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: m.created_at,
          persona: m.persona,
          audioUrl: m.audio_url
        })) || []);
        
        logger.info('Loaded active Phoenix session', 'PHOENIX_SESSION', { sessionId: session.id, messageCount: msgs?.length });
      } else {
        // No active session, will create one when user starts chatting
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
      // Mark current session as archived if exists
      if (sessionId) {
        await supabase
          .from('phoenix_conversations')
          .update({ status: 'archived', updated_at: new Date().toISOString() })
          .eq('id', sessionId);
      }

      // Create new session
      const { data, error } = await supabase
        .from('phoenix_conversations')
        .insert({
          user_id: userId,
          session_title: 'New Phoenix Session',
          status: 'active',
          session_metadata: {},
          last_active_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setMessages([]);
      
      logger.info('Started new Phoenix session', 'PHOENIX_SESSION', { sessionId: data.id });
      
      toast({
        title: 'New chat started',
        description: 'Previous chat archived',
        duration: 2000
      });

      return data.id;
    } catch (error) {
      logger.error('Failed to start new session', 'PHOENIX_SESSION', error);
      toast({
        title: 'Failed to start new chat',
        description: 'Please try again',
        variant: 'destructive'
      });
      return null;
    }
  }, [userId, sessionId, toast]);

  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (sessionId) return sessionId;
    
    // Create initial session if none exists
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('phoenix_conversations')
        .insert({
          user_id: userId,
          session_title: 'Phoenix Session',
          status: 'active',
          session_metadata: {},
          last_active_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;

      setSessionId(data.id);
      logger.info('Created initial Phoenix session', 'PHOENIX_SESSION', { sessionId: data.id });
      return data.id;
    } catch (error) {
      logger.error('Failed to ensure session', 'PHOENIX_SESSION', error);
      return null;
    }
  }, [sessionId, userId]);

  const saveMessage = useCallback(async (message: Omit<PhoenixMessage, 'id' | 'timestamp'>): Promise<PhoenixMessage | null> => {
    const currentSessionId = await ensureSession();
    if (!currentSessionId) return null;

    try {
      const { data, error } = await supabase
        .from('phoenix_messages')
        .insert({
          conversation_id: currentSessionId,
          role: message.role,
          content: message.content,
          persona: message.persona,
          audio_url: message.audioUrl
        })
        .select('*')
        .single();

      if (error) throw error;

      const savedMessage: PhoenixMessage = {
        id: data.id,
        role: data.role as 'user' | 'assistant',
        content: data.content,
        timestamp: data.created_at,
        persona: data.persona,
        audioUrl: data.audio_url
      };

      setMessages(prev => [...prev, savedMessage]);

      // Update last_active_at
      await supabase
        .from('phoenix_conversations')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', currentSessionId);

      return savedMessage;
    } catch (error) {
      logger.error('Failed to save message', 'PHOENIX_SESSION', error);
      return null;
    }
  }, [ensureSession]);

  const loadSession = useCallback(async (id: string) => {
    try {
      setIsLoading(true);

      // Mark current session as archived
      if (sessionId) {
        await supabase
          .from('phoenix_conversations')
          .update({ status: 'archived' })
          .eq('id', sessionId);
      }

      // Load selected session
      const { data: session, error: sessionError } = await supabase
        .from('phoenix_conversations')
        .select('*')
        .eq('id', id)
        .single();

      if (sessionError) throw sessionError;

      // Mark as active
      await supabase
        .from('phoenix_conversations')
        .update({ status: 'active', last_active_at: new Date().toISOString() })
        .eq('id', id);

      // Load messages
      const { data: msgs, error: msgsError } = await supabase
        .from('phoenix_messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (msgsError) throw msgsError;

      setSessionId(id);
      setMessages(msgs?.map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: m.created_at,
        persona: m.persona,
        audioUrl: m.audio_url
      })) || []);

      logger.info('Loaded Phoenix session', 'PHOENIX_SESSION', { sessionId: id, messageCount: msgs?.length });
      
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
  }, [sessionId, toast]);

  const addMessageToState = useCallback((message: PhoenixMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  return {
    sessionId,
    messages,
    isLoading,
    startNewSession,
    saveMessage,
    loadSession,
    addMessageToState,
    setMessages
  };
};

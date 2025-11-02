import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CoachPersona } from './useCoachSelection';

export interface CommandCenterMessage {
  id: string;
  persona: 'USER' | 'BETTY' | 'AL' | 'CONDUCTOR' | 'NITE_OWL';
  content: string;
  intent?: string;
  sentiment?: string;
  metadata?: any;
  created_at: string;
  audioUrl?: string;
  isStreaming?: boolean;
}

export function useCommandCenterChat(userId?: string) {
  const [messages, setMessages] = useState<CommandCenterMessage[]>([]);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = useCallback(async (
    messageText: string, 
    selectedCoach: CoachPersona,
    previousCoach?: CoachPersona
  ) => {
    if (!userId || !messageText.trim()) return;

    const userMessage: CommandCenterMessage = {
      id: crypto.randomUUID(),
      persona: 'USER',
      content: messageText,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: {
          message: messageText,
          conversationId,
          userId,
          persona: selectedCoach,
          sessionId: conversationId,
          metadata: {
            source: 'ai_command_center_v2',
            previousPersona: previousCoach,
            audioEnabled
          }
        }
      });

      if (error) throw error;

      const aiMessage: CommandCenterMessage = {
        id: data.messageId || crypto.randomUUID(),
        persona: selectedCoach,
        content: data.response,
        intent: data.intent,
        sentiment: data.sentiment,
        metadata: data.metadata,
        created_at: new Date().toISOString(),
        audioUrl: data.audioUrl,
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [userId, conversationId, audioEnabled, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    audioEnabled,
    setAudioEnabled,
    speakingMessageId,
    setSpeakingMessageId,
    sendMessage,
    clearMessages,
    conversationId
  };
}

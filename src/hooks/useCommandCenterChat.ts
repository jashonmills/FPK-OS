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

  const sendMessage = useCallback(async (messageText: string) => {
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
      // Get auth session for streaming
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call Phoenix orchestrator with streaming
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach-orchestrator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            message: messageText,
            conversationId,
            conversationHistory: messages
              .filter(m => m.persona !== 'USER' || !m.isStreaming)
              .map(m => ({
                persona: m.persona,
                content: m.content
              })),
            metadata: {
              source: 'ai_command_center_v2',
              audioEnabled
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Handle streaming SSE response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageId = crypto.randomUUID();
      let currentPersona: CommandCenterMessage['persona'] = 'AL';
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Process complete SSE lines
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 2);
          
          if (!line || !line.startsWith('data: ')) continue;
          
          try {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;
            
            const data = JSON.parse(jsonStr);

            if (data.type === 'chunk') {
              fullText += data.content;
              currentPersona = data.persona;
              
              // Update or create streaming message
              setMessages(prev => {
                const existing = prev.find(m => m.id === aiMessageId);
                if (existing) {
                  return prev.map(m => 
                    m.id === aiMessageId 
                      ? { ...m, content: fullText, persona: currentPersona, isStreaming: true }
                      : m
                  );
                }
                return [...prev, {
                  id: aiMessageId,
                  persona: currentPersona,
                  content: fullText,
                  created_at: new Date().toISOString(),
                  isStreaming: true
                }];
              });
            } else if (data.type === 'handoff') {
              // Nite Owl handoff or persona transition
              const handoffMessage: CommandCenterMessage = {
                id: crypto.randomUUID(),
                persona: data.persona,
                content: data.content,
                created_at: new Date().toISOString(),
                audioUrl: data.audioUrl
              };
              setMessages(prev => [...prev, handoffMessage]);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }

      // Mark final message as complete
      setMessages(prev => 
        prev.map(m => 
          m.id === aiMessageId 
            ? { ...m, isStreaming: false }
            : m
        )
      );

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
  }, [userId, conversationId, messages, audioEnabled, toast]);

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

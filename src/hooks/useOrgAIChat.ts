import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrgChatMessage {
  id: string;
  persona: 'USER' | 'BETTY' | 'AL' | 'CONDUCTOR' | 'NITE_OWL';
  role?: 'user' | 'assistant'; // Keep for backward compatibility
  content: string;
  timestamp?: Date;
  created_at: string;
  audioUrl?: string;
  isStreaming?: boolean;
}

interface UseOrgAIChatProps {
  userId?: string;
  orgId?: string;
  orgName?: string;
}

export const useOrgAIChat = ({ userId, orgId, orgName }: UseOrgAIChatProps) => {
  const [messages, setMessages] = useState<OrgChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const { toast } = useToast();

  const sendMessage = useCallback(async (messageText: string) => {
    console.log('[useOrgAIChat] 📨 sendMessage called', { 
      hasUserId: !!userId, 
      userId,
      hasMessage: !!messageText.trim(),
      messageLength: messageText.length
    });
    
    if (!userId || !messageText.trim() || isSending) {
      console.log('[useOrgAIChat] ❌ Validation failed');
      return;
    }

    const userMessage: OrgChatMessage = {
      id: crypto.randomUUID(),
      persona: 'USER',
      role: 'user',
      content: messageText,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      // Get auth session for streaming
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call orchestrator with streaming
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
              audioEnabled: false,
              contextData: {
                context: 'org_study_coach',
                orgId: orgId,
                orgName: orgName,
                isOrgContext: true
              }
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
      let currentPersona: OrgChatMessage['persona'] = 'AL';
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
                  role: 'assistant',
                  content: fullText,
                  created_at: new Date().toISOString(),
                  isStreaming: true
                }];
              });
            } else if (data.type === 'handoff') {
              // Nite Owl handoff or persona transition
              const handoffMessage: OrgChatMessage = {
                id: crypto.randomUUID(),
                persona: data.persona,
                role: 'assistant',
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
      console.error('Org chat error:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        persona: 'AL',
        role: 'assistant',
        content: "I apologize, but I encountered an issue. Please try asking your question again.",
        created_at: new Date().toISOString(),
      }]);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  }, [userId, orgId, orgName, conversationId, messages, isSending, toast]);

  const clearAllMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const initializeChat = useCallback((userName?: string) => {
    if (messages.length === 0) {
      setMessages([{
        id: crypto.randomUUID(),
        persona: 'BETTY',
        role: 'assistant',
        content: `Hello ${userName || 'there'}! I'm Betty, your AI Study Coach here at ${orgName || 'your organization'}. I'm here to help you with study strategies, learning techniques, and academic support using the Socratic method. What would you like to explore today?`,
        created_at: new Date().toISOString(),
      }]);
    }
  }, [messages.length, orgName]);

  return {
    messages,
    isSending,
    sendMessage,
    clearAllMessages,
    initializeChat,
  };
};
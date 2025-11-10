import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrgChatMessage {
  id: string;
  persona: 'USER' | 'BETTY' | 'AL' | 'CONDUCTOR' | 'NITE_OWL';
  role?: 'user' | 'assistant'; // Keep for backward compatibility
  content: string;
  timestamp?: Date;
  created_at: string;
  audioUrl?: string;
  isStreaming?: boolean;
  groupId?: string; // NEW: For grouping collaborative responses
}

interface DialogueEvent {
  type: 'dialogue';
  dialogue: Array<{
    persona: 'BETTY' | 'AL';
    text: string;
  }>;
  audioUrl?: string;
  ttsProvider?: string;
  metadata?: Record<string, any>;
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
  const [isStreamActive, setIsStreamActive] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const sendMessage = useCallback(async (messageText: string, attachedMaterialIds?: string[]) => {
    console.log('[useOrgAIChat] 📨 sendMessage called', { 
      hasUserId: !!userId, 
      userId,
      hasMessage: !!messageText.trim(),
      messageLength: messageText.length,
      attachedMaterialIds: attachedMaterialIds || []
    });
    
    // Prevent concurrent streams
    if (isStreamActive) {
      console.log('[useOrgAIChat] ⚠️ Stream already active, blocking concurrent send');
      return;
    }
    
    if (!userId || !messageText.trim()) {
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

    // Cancel any ongoing stream
    if (abortControllerRef.current) {
      console.log('[useOrgAIChat] ⚠️ Aborting previous stream');
      abortControllerRef.current.abort();
    }
    
    // Create new controller
    abortControllerRef.current = new AbortController();
    setIsStreamActive(true);

    try {
      // Get auth session for streaming
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call orchestrator with streaming
      // Create request body
      const requestBody = {
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
          attachedMaterialIds: attachedMaterialIds || [], // ✅ Move inside metadata
          contextData: {
            context: 'org_study_coach',
            orgId: orgId,
            orgName: orgName,
            isOrgContext: true
          }
        }
      };

      console.log('[useOrgAIChat] 📤 Request body being sent:', {
        hasAttachments: (attachedMaterialIds || []).length > 0,
        attachedMaterialIds: attachedMaterialIds || [],
        messagePreview: requestBody.message.substring(0, 50)
      });

      const response = await fetch(
        `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/ai-coach-orchestrator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnY2Vna21xZmd6bmJwZHBsc2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDcxNTgsImV4cCI6MjA2NDk4MzE1OH0.RCtAqfgz7aqjG-QWiOqFBCG5xg2Rok9T4tbyGQMnCm8'
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal
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
            } else if (data.type === 'dialogue') {
              // V2-DIALOGUE: Handle multi-speaker collaboration with groupId and separate audio
              console.log('[useOrgAIChat] 📢 Received grouped dialogue event:', data);
              
              const groupId = data.groupId || crypto.randomUUID(); // Fallback for backward compatibility
              
              // Add each speaker's line as a separate message with groupId and individual audio
              if (data.dialogue && Array.isArray(data.dialogue)) {
                data.dialogue.forEach((line: { 
                  persona: string; 
                  text: string; 
                  audioUrl?: string; 
                  groupId?: string; 
                }) => {
                  const dialogueMessage: OrgChatMessage = {
                    id: crypto.randomUUID(),
                    persona: line.persona as OrgChatMessage['persona'],
                    role: 'assistant',
                    content: line.text,
                    created_at: new Date().toISOString(),
                    audioUrl: line.audioUrl, // SEPARATE audio for each speaker
                    groupId: line.groupId || groupId // Use line-specific or shared groupId
                  };
                  
                  setMessages(prev => [...prev, dialogueMessage]);
                });
              }
              
              // Reset streaming state since dialogue is delivered as complete messages
              fullText = '';
              aiMessageId = crypto.randomUUID();
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
      // Don't show error if request was aborted (user sent new message)
      if (error.name === 'AbortError') {
        console.log('[useOrgAIChat] Stream aborted by new message');
        return;
      }
      
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
      setIsStreamActive(false);
      abortControllerRef.current = null;
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
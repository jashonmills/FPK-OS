import { useState, useCallback, useRef } from 'react';
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const sendMessage = useCallback(async (messageText: string) => {
    console.log('[useCommandCenterChat] 📨 sendMessage called', { 
      hasUserId: !!userId, 
      userId,
      hasMessage: !!messageText.trim(),
      messageLength: messageText.length
    });
    
    // Prevent concurrent streams
    if (isStreamActive) {
      console.log('[useCommandCenterChat] ⚠️ Stream already active, blocking concurrent send');
      return;
    }
    
    if (!userId || !messageText.trim()) {
      console.log('[useCommandCenterChat] ❌ Validation failed - userId or message missing');
      return;
    }

    // 🔐 PHASE 1.2: Initialize server-side session on first message
    let activeSessionId = conversationId;
    
    if (!activeSessionId) {
      console.log('[useCommandCenterChat] 🔐 First message - creating server-side session');
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No active session');
        }

        const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
          'create-coach-session',
          {
            body: {
              source: 'ai_command_center_v2',
              contextData: { isOrgContext: true }
            }
          }
        );

        if (sessionError || !sessionData?.session_id) {
          console.error('[useCommandCenterChat] ❌ Failed to create server-side session:', sessionError);
          throw new Error('Failed to initialize secure session');
        }

        console.log('[useCommandCenterChat] ✅ Server-side session created:', sessionData.session_id);
        activeSessionId = sessionData.session_id;
        setConversationId(activeSessionId);
        
      } catch (error: any) {
        console.error('[useCommandCenterChat] ❌ Session initialization failed:', error);
        toast({
          title: 'Session Error',
          description: 'Failed to initialize secure chat session. Please refresh and try again.',
          variant: 'destructive'
        });
        return;
      }
    }

    const userMessage: CommandCenterMessage = {
      id: crypto.randomUUID(),
      persona: 'USER',
      content: messageText,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    // Cancel any ongoing stream
    if (abortControllerRef.current) {
      console.log('[useCommandCenterChat] ⚠️ Aborting previous stream');
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

      // Call Phoenix orchestrator with streaming
      const response = await fetch(
        `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/ai-coach-orchestrator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnY2Vna21xZmd6bmJwZHBsc2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDcxNTgsImV4cCI6MjA2NDk4MzE1OH0.RCtAqfgz7aqjG-QWiOqFBCG5xg2Rok9T4tbyGQMnCm8'
          },
          body: JSON.stringify({
            message: messageText,
            conversationId: activeSessionId,
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
          }),
          signal: abortControllerRef.current.signal
        }
      );

      if (!response.ok) {
        // Handle Knowledge Pack failure (503 Service Unavailable)
        if (response.status === 503) {
          const errorData = await response.json().catch(() => ({}));
          const userMessage = errorData.message || 'The AI coach is temporarily unavailable. Please try again in a few minutes.';
          
          toast({
            title: 'Service Temporarily Unavailable',
            description: userMessage,
            variant: 'destructive',
            duration: 10000
          });
          return;
        }
        
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
      // Don't show error if request was aborted (user sent new message)
      if (error.name === 'AbortError') {
        console.log('[useCommandCenterChat] Stream aborted by new message');
        return;
      }
      
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setIsStreamActive(false);
      abortControllerRef.current = null;
    }
  }, [userId, conversationId, messages, audioEnabled, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null); // Reset session for new conversation
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

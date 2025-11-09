import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrgChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseOrgAIChatProps {
  userId?: string;
  orgId?: string;
  orgName?: string;
}

export const useOrgAIChat = ({ userId, orgId, orgName }: UseOrgAIChatProps) => {
  const [messages, setMessages] = useState<OrgChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const { toast } = useToast();

  const addMessage = useCallback((message: Omit<OrgChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: OrgChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;

    setIsSending(true);

    try {
      // Add user message immediately
      addMessage({
        role: 'user',
        content: content.trim(),
      });

      // Build lightweight client history (last 6 messages)
      const clientHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString()
      }));

      // Call AI orchestrator with organization context
      const { data, error } = await supabase.functions.invoke('ai-coach-orchestrator', {
        body: { 
          message: content,
          userId: userId,
          conversationId: threadId || `org-coach-${orgId}-${userId}`,
          voiceActive: false,
          metadata: {
            source: 'ai_command_center_v2',
            contextData: {
              context: 'org_study_coach',
              orgId: orgId,
              orgName: orgName,
              isOrgContext: true
            }
          }
        }
      });

      if (error) throw error;

      // Store thread ID for conversation continuity
      if (data.threadId) {
        setThreadId(data.threadId);
      }

      // Add AI response
      addMessage({
        role: 'assistant',
        content: data.response || "I'm here to help with your learning journey within your organization!",
      });

    } catch (error) {
      console.error('Error sending org AI chat message:', error);
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: "I apologize, but I encountered an issue. Please try asking your question again.",
      });
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  }, [isSending, userId, orgId, orgName, messages, addMessage, toast]);

  const clearAllMessages = useCallback(() => {
    setMessages([]);
    setThreadId(null); // Reset thread when clearing messages
  }, []);

  const initializeChat = useCallback((userName?: string) => {
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: `Hello ${userName || 'there'}! I'm your AI Study Coach here at ${orgName || 'your organization'}. I'm here to help you with study strategies, learning techniques, and academic support using the Socratic method. What would you like to explore today?`,
      });
    }
  }, [messages.length, addMessage, orgName]);

  return {
    messages,
    isSending,
    sendMessage,
    clearAllMessages,
    initializeChat,
  };
};
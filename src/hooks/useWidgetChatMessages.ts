
import { useState } from 'react';
import { useWidgetChatStorage } from './useWidgetChatStorage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WidgetMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useWidgetChatMessages = (userId?: string) => {
  const [isSending, setIsSending] = useState(false);
  const { messages, addMessage, deleteMessage, clearAllMessages } = useWidgetChatStorage(userId);
  const { toast } = useToast();

  const sendMessage = async (content: string, context?: any) => {
    if (!content.trim() || isSending) return;

    setIsSending(true);

    try {
      // Add user message immediately
      const userMessage = addMessage({
        role: 'user',
        content: content.trim(),
      });

      // Build lightweight client history (last 6 messages)
      const clientHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }));

      // Call enhanced AI function for widget context with RAG support
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: content,
          userId: userId,
          sessionId: null, // Widget doesn't use database sessions
          chatMode: 'general', // Widget uses general mode by default
          voiceActive: false,
          isWidget: true, // Flag to identify widget context
          metadata: {
            context: context || 'widget_chat'
          },
          clientHistory
        }
      });

      if (error) throw error;

      // Add AI response
      const aiMessage = addMessage({
        role: 'assistant',
        content: data.response || "I'm here to help with your learning journey!",
      });

    } catch (error) {
      console.error('Error sending widget message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isSending,
    sendMessage,
    deleteMessage,
    clearAllMessages,
  };
};

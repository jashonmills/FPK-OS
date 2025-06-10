
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useChatMessages = (sessionId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load messages for a session
  const loadMessages = async () => {
    if (!sessionId || !user) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error loading messages",
        description: "There was a problem loading the chat messages.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a message to the current session
  const addMessage = async (content: string, role: 'user' | 'assistant') => {
    if (!sessionId || !user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role,
          content,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Send a user message and get AI response
  const sendMessage = async (content: string, context?: string) => {
    if (!sessionId || !user || isSending) return;

    setIsSending(true);
    
    try {
      // Add user message
      await addMessage(content, 'user');

      // Get AI response
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: `${context ? `Context: ${context}\n\n` : ''}${content}`,
          userId: user.id,
          sessionId: sessionId
        }
      });

      if (error) throw error;

      const aiResponse = data?.response || "I'm here to help guide your learning journey!";
      
      // Add AI response
      await addMessage(aiResponse, 'assistant');

      // Update session title if this is the first user message
      if (messages.length === 0) {
        const title = content.length > 50 ? content.substring(0, 50) + '...' : content;
        await supabase
          .from('chat_sessions')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', sessionId);
      }

    } catch (error) {
      console.error('Error in sendMessage:', error);
      const fallbackMessage = "I'm having trouble connecting right now, but I'm still here to help! Try asking about study strategies or platform features.";
      await addMessage(fallbackMessage, 'assistant');
      
      toast({
        title: "Connection issue",
        description: "AI coach is temporarily unavailable, but you can still ask for help.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [sessionId]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    addMessage,
    loadMessages
  };
};

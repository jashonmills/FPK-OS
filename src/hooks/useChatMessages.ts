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
      
      // Type-safe conversion with proper role casting
      const typedMessages: ChatMessage[] = (data || []).map(msg => ({
        id: msg.id,
        session_id: msg.session_id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));
      
      setMessages(typedMessages);
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

      // Type-safe message addition
      const newMessage: ChatMessage = {
        id: data.id,
        session_id: data.session_id,
        role: data.role as 'user' | 'assistant',
        content: data.content,
        timestamp: data.timestamp
      };

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
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

  // Enhanced sendMessage with page context
  const sendMessage = async (content: string, context?: string) => {
    if (!sessionId || !user || isSending) return;

    console.log('Starting enhanced sendMessage flow...', { sessionId, content, context });
    setIsSending(true);
    
    try {
      // Add user message first
      const userMessage = await addMessage(content, 'user');
      if (!userMessage) {
        throw new Error('Failed to save user message');
      }

      // Call enhanced AI function with comprehensive context
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: content,
          userId: user.id,
          sessionId: sessionId,
          pageContext: context
        }
      });

      if (error) {
        console.error('Enhanced AI function error:', error);
        throw error;
      }

      const aiResponse = data?.response || "I'm here to guide your learning journey! 🌟";
      
      // Add AI response with enhanced formatting
      const assistantMessage = await addMessage(aiResponse, 'assistant');
      if (!assistantMessage) {
        throw new Error('Failed to save AI response');
      }

      // Update session title if this is the first meaningful exchange
      if (messages.length <= 1) {
        const title = content.length > 50 ? content.substring(0, 50) + '...' : content;
        await supabase
          .from('chat_sessions')
          .update({ 
            title, 
            updated_at: new Date().toISOString(),
            context_tag: context?.includes('Notes') ? 'Study Notes' : 
                        context?.includes('Coach') ? 'AI Coaching' : 
                        context?.includes('Flashcard') ? 'Flashcard Help' : 'Study Support'
          })
          .eq('id', sessionId);
      }

    } catch (error) {
      console.error('Error in enhanced sendMessage:', error);
      
      // Enhanced fallback with context awareness
      const contextualFallback = context?.includes('Notes') 
        ? "I'm here to help with your notes and study materials! Try asking about study strategies or note-taking techniques."
        : context?.includes('Flashcard')
        ? "I can help you optimize your flashcard study sessions! Ask me about spaced repetition or memory techniques."
        : "I'm your AI learning coach! Ask me about study strategies, concepts, or how to improve your learning effectiveness.";
        
      await addMessage(contextualFallback, 'assistant');
      
      toast({
        title: "AI Coach Ready",
        description: "I'm here to help with your studies - just ask!",
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

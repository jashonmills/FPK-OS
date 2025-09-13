import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useConversationState } from '@/hooks/useConversationState';

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
  const { analyzeConversation } = useConversationState();

  // Load messages for a session
  const loadMessages = async () => {
    // Critical validation: ensure we have valid UUIDs before database queries
    if (!sessionId || !user?.id || typeof sessionId !== 'string' || typeof user.id !== 'string') {
      console.warn('Invalid parameters for loadMessages:', { sessionId, userId: user?.id });
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
    // Critical validation: ensure we have valid UUIDs before database operations
    if (!sessionId || !user?.id || typeof sessionId !== 'string' || typeof user.id !== 'string') {
      console.warn('Invalid parameters for addMessage:', { sessionId, userId: user?.id });
      return null;
    }

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

  // Simplified hybrid sendMessage with backend-driven intelligence
  const sendMessage = async (content: string, context?: string, chatMode: 'personal' | 'general' = 'general') => {
    if (!user?.id || isSending || typeof user.id !== 'string') {
      console.warn('Invalid user or sending state:', { userId: user?.id, isSending });
      throw new Error('Invalid user state');
    }
    
    if (!sessionId || typeof sessionId !== 'string') {
      console.warn('Invalid session ID for sendMessage:', { sessionId });
      throw new Error('No active session. Please refresh the page.');
    }

    console.log('🎯 Hybrid sendMessage - Backend-driven analysis...', { 
      sessionId: sessionId.substring(0, 8) + '...', 
      content: content.substring(0, 50) + '...', 
      chatMode 
    });
    
    setIsSending(true);
    
    try {
      // Add user message first
      const userMessage = await addMessage(content, 'user');
      if (!userMessage) {
        throw new Error('Failed to save user message');
      }

      // Backend conversation analysis - moved from AI layer
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      const conversationState = analyzeConversation(conversationHistory, content);
      
      // Prepare simple context data for Edge Function
      const contextData: any = {};
      
      if (conversationState.promptType === 'initiate_quiz' && conversationState.currentTopic) {
        contextData.quizTopic = conversationState.currentTopic;
      }
      
      if (conversationState.promptType === 'evaluate_answer') {
        contextData.teachingHistory = conversationState.teachingMethods?.join(', ') || '';
        contextData.incorrectCount = conversationState.incorrectAnswersCount;
      }

      // Call simplified AI function with backend-determined prompt type
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: content,
          userId: user.id,
          sessionId: sessionId,
          promptType: conversationState.promptType,
          contextData: contextData,
          chatMode: chatMode,
          voiceActive: false
        }
      });

      if (error) {
        console.error('🚨 Hybrid AI function error:', error);
        throw error;
      }

      console.log('✅ Hybrid response received:', {
        promptType: conversationState.promptType,
        hasResponse: !!data?.response,
        source: data?.source
      });

      const aiResponse = data?.response || "I'm your AI study coach, ready to guide your learning through thoughtful questions! 🎓 What would you like to explore together?";
      
      // Add AI response
      const assistantMessage = await addMessage(aiResponse, 'assistant');
      if (!assistantMessage) {
        throw new Error('Failed to save AI response');
      }

      // Update session metadata on first message
      if (messages.length <= 1) {
        const title = content.length > 40 ? content.substring(0, 40) + '...' : content;
        const contextTag = context?.includes('Notes') ? 'Study Notes' : 
                         context?.includes('Coach') ? 'AI Coaching' : 
                         context?.includes('Flashcard') ? 'Flashcard Help' : 
                         content.toLowerCase().includes('quiz') ? 'Quiz Help' :
                         chatMode === 'personal' ? 'Socratic Learning Session' : 'General Knowledge Exploration';
                         
        await supabase
          .from('chat_sessions')
          .update({ 
            title, 
            updated_at: new Date().toISOString(),
            context_tag: contextTag
          })
          .eq('id', sessionId);
      }

      toast({
        title: "🎯 Hybrid AI Active",
        description: `Using ${conversationState.promptType.replace('_', ' ')} approach`,
      });

    } catch (error) {
      console.error('❌ Error in hybrid sendMessage:', error);
      
      const contextualFallback = chatMode === 'personal'
        ? "I'm your AI learning coach, ready to guide your discovery through questions! 🔍 What aspect of this topic would you like to explore first?"
        : "I'm here to facilitate your learning through guided inquiry! 🌐 What would you like to explore today?";
        
      await addMessage(contextualFallback, 'assistant');
      
      toast({
        title: "🤔 Socratic Mode Active",
        description: "I'm here to guide your learning through thoughtful questions!",
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

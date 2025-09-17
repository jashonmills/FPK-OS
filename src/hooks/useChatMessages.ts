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
      throw new Error('Invalid user state');
    }
    
    if (!sessionId || typeof sessionId !== 'string') {
      throw new Error('No active session. Please refresh the page.');
    }

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

      let conversationState;
      try {
        conversationState = analyzeConversation(conversationHistory, content);
      } catch (error) {
        // Fallback to default state
        conversationState = {
          promptType: 'general_guidance',
          isInQuiz: false,
          inRefresherMode: false,
          lastAIQuestion: null,
          currentTopic: null,
          incorrectAnswersCount: 0,
          teachingMethods: []
        };
      }
      
      // Prepare simple context data for Edge Function
      const contextData: Record<string, unknown> = {};
      
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
        source: data?.source,
        error: data?.error
      });

      // Better error handling and contextual responses
      if (!data?.response) {
        console.error('🚨 No response from AI function:', data);
        
        // Show specific error information to help diagnose the issue
        if (data?.error) {
          console.error('🚨 Edge Function Error Details:', data.error);
          
          // If it's an API authentication error, show helpful message
          if (data.error.includes('401') || data.error.includes('authentication_error')) {
            const errorMsg = 'The AI service is experiencing authentication issues. The response has been generated using fallback methods.';
            console.log('🔄 Using fallback response due to API auth issue');
            
            // Use the fallback response from the Edge Function
            const fallbackResponse = data?.response || getContextualErrorResponse(content, chatMode, new Error('API authentication issue'));
            await addMessage(fallbackResponse, 'assistant');
            return;
          }
        }
        
        throw new Error(`AI service error: ${data?.error || 'No response received'}`);
      }

      const aiResponse = data.response;
      
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
      
      // Provide a contextual error response that acknowledges what the user asked
      const contextualFallback = getContextualErrorResponse(content, chatMode, error);
      
      await addMessage(contextualFallback, 'assistant');
      
      toast({
        title: "⚠️ Connection Issue",
        description: `There's a technical problem, but I tried to help with "${content.substring(0, 30)}..."`,
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

// Helper function to provide contextual error responses
function getContextualErrorResponse(message: string, chatMode: string, error: Error): string {
  const lowerMessage = message.toLowerCase();
  
  // Math questions - provide the answer even if AI is down
  if (lowerMessage.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
    const mathMatch = message.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
    if (mathMatch) {
      const [, num1, op, num2] = mathMatch;
      const a = parseInt(num1), b = parseInt(num2);
      let result;
      switch(op) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b !== 0 ? a / b : 'undefined (cannot divide by zero)'; break;
      }
      
      return `I can still help with your math question! ${num1} ${op} ${num2} = ${result} 🧮\n\nI'm having technical difficulties with my full AI capabilities, but I wanted to make sure you got an answer to your calculation. Once I'm back online, I can guide you through more complex mathematical concepts!`;
    }
  }
  
  // Extract key topics from the message
  const topics = [];
  if (lowerMessage.includes('cloud')) topics.push('clouds');
  if (lowerMessage.includes('weather')) topics.push('weather');
  if (lowerMessage.includes('science')) topics.push('science');
  if (lowerMessage.includes('math')) topics.push('mathematics');
  if (lowerMessage.includes('history')) topics.push('history');
  
  const topicText = topics.length > 0 ? topics.join(', ') : 'this topic';
  
  if (chatMode === 'personal') {
    return `I apologize - I'm experiencing technical difficulties and can't provide my full Socratic guidance right now. But I noticed you're interested in ${topicText}! 

While I work on reconnecting, here's what I'd normally ask you: What do you already know about ${topicText}? What specific aspect makes you curious? 

Error details: ${error.message || 'Connection issue'}`;
  } else {
    return `I'm having technical difficulties but I see you're asking about ${topicText}. Let me try to help while I resolve the connection issue.

What specific aspect of ${topicText} would you like to explore? I'll do my best to assist even with limited capabilities.

Technical details: ${error.message || 'Service temporarily unavailable'}`;
  }
}

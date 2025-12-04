import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface UseLessonChatProps {
  courseId: string;
  lessonId: number;
  lessonTitle: string;
}

export const useLessonChat = ({ courseId, lessonId, lessonTitle }: UseLessonChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (userMessage: string, lessonContent: string) => {
    if (!userMessage.trim()) return;

    const timestamp = new Date().toISOString();
    
    // Add user message immediately
    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp
    };
    
    setMessages(prev => {
      const newMessages = [...prev, userMsg];
      
      // Prepare the request with lesson context immediately
      const requestBody = {
        message: userMessage,
        userId: null, // Will be set later
        sessionId: `lesson-${courseId}-${lessonId}`,
        promptType: 'course_tutor',
        chatMode: 'personal',
        voiceActive: false,
        clientHistory: prev, // Use prev messages to avoid circular dependency
        originalTopic: lessonTitle,
        lessonContext: {
          courseId,
          lessonId,
          lessonTitle,
          lessonContent
        }
      };

      // Process API call asynchronously
      setIsLoading(true);
      
      (async () => {
        try {
          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('User not authenticated');
          }

          requestBody.userId = user.id;

          console.log('Sending lesson chat request:', {
            courseId,
            lessonId,
            lessonTitle,
            messageLength: userMessage.length,
            contentLength: lessonContent.length
          });

          // Call the AI study chat function
          const { data, error } = await supabase.functions.invoke('ai-study-chat', {
            body: requestBody
          });

          if (error) {
            console.error('AI chat function error:', error);
            throw new Error('Failed to get AI response');
          }

          const aiResponse = data?.response || 'I apologize, but I encountered an issue. Please try asking your question again.';

          // Add AI response
          const aiMsg: ChatMessage = {
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString()
          };

          setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
          console.error('Error sending lesson chat message:', error);
          
          // Add error message
          const errorMsg: ChatMessage = {
            role: 'assistant',
            content: 'I apologize, but I encountered an issue. Please try asking your question again.',
            timestamp: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, errorMsg]);
          
          toast({
            title: "Chat Error",
            description: "There was an issue with the chat. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      })();

      return newMessages;
    });
  }, [courseId, lessonId, lessonTitle, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};
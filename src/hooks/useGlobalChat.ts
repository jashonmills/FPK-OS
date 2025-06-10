
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp: Date;
  context?: string;
}

export const useGlobalChat = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('global-chat-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const historyWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setChatHistory(historyWithDates);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    } else if (user) {
      // Initialize with welcome message
      const welcomeMessage = {
        role: 'assistant' as const,
        message: `Hi! I'm your AI Learning Coach. I'm here to help you navigate the platform, provide study guidance, and answer any questions. How can I assist you today?`,
        timestamp: new Date()
      };
      setChatHistory([welcomeMessage]);
    }
  }, [user]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('global-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasUnreadMessages(false);
    }
  }, [isOpen]);

  const sendMessage = async (message: string, context?: string) => {
    if (!message.trim() || isLoading || !user) return;

    const userMessage: ChatMessage = {
      role: 'user',
      message: message.trim(),
      timestamp: new Date(),
      context
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-study-chat', {
        body: { 
          message: `${context ? `Context: ${context}\n\n` : ''}${message}`,
          userId: user.id
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        message: data?.response || "I'm here to help guide your learning journey!",
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, assistantMessage]);

      // Set unread indicator if chat is closed
      if (!isOpen) {
        setHasUnreadMessages(true);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMessage: ChatMessage = {
        role: 'assistant',
        message: "I'm having trouble connecting right now, but I'm still here to help! Try asking about study strategies or platform features.",
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, fallbackMessage]);
      
      toast({
        title: "Connection issue",
        description: "AI coach is temporarily unavailable, but you can still ask for help.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('global-chat-history');
    setHasUnreadMessages(false);
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return {
    chatHistory,
    isLoading,
    isOpen,
    hasUnreadMessages,
    sendMessage,
    clearHistory,
    toggleChat,
    setIsOpen
  };
};


import { useState, useEffect } from 'react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { logger } from '@/utils/logger';

interface WidgetMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useWidgetChatStorage = (userId?: string) => {
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const storageKey = `widgetChatHistory_${userId || 'anonymous'}`;

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = safeLocalStorage.getItem<string>(storageKey, { fallbackValue: null });
      if (stored && stored.trim()) {
        try {
          const parsedMessages = JSON.parse(stored);
          setMessages(Array.isArray(parsedMessages) ? parsedMessages : []);
        } catch (parseError) {
          // Clear corrupted data silently
          logger.warn('Corrupted chat history detected, clearing storage', 'STORAGE');
          safeLocalStorage.removeItem(storageKey);
          setMessages([]);
        }
      }
    } catch (error) {
      logger.warn('Error loading widget chat history', 'STORAGE', error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load
    
    try {
      safeLocalStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      logger.warn('Error saving widget chat history', 'STORAGE', error);
    }
  }, [messages, storageKey, isLoaded]);

  const addMessage = (message: Omit<WidgetMessage, 'id' | 'timestamp'>) => {
    const newMessage: WidgetMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const clearAllMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    addMessage,
    deleteMessage,
    clearAllMessages,
    isLoaded,
  };
};

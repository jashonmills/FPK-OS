
import { useState, useEffect } from 'react';

interface WidgetMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useWidgetChatStorage = (userId?: string) => {
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const storageKey = `widgetChatHistory_${userId || 'anonymous'}`;

  // Load messages from localStorage on mount
  useEffect(() => {
    if (!userId) return;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedMessages = JSON.parse(stored);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading widget chat history:', error);
    }
  }, [storageKey, userId]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (!userId) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving widget chat history:', error);
    }
  }, [messages, storageKey, userId]);

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
  };
};

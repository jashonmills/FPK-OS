
import { useState, useEffect } from 'react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useWidgetChatMessages } from '@/hooks/useWidgetChatMessages';
import { useAuth } from '@/hooks/useAuth';

export const useGlobalChat = () => {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { user } = useAuth();
  const { sessions, currentSessionId } = useChatSessions();
  const { messages } = useChatMessages(currentSessionId);
  const { messages: widgetMessages } = useWidgetChatMessages(user?.id);

  // For now, we'll implement a simple unread logic
  // This can be enhanced later with proper read/unread tracking
  useEffect(() => {
    // Check if there are any recent AI messages in widget chat
    const recentWidgetMessages = widgetMessages.filter(msg => 
      msg.role === 'assistant' && 
      new Date(msg.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    );
    
    // Check if there are any recent AI messages in regular chat
    const recentMessages = messages.filter(msg => 
      msg.role === 'assistant' && 
      new Date(msg.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    );
    
    // Show unread indicator if there are recent messages in either context
    setHasUnreadMessages(recentWidgetMessages.length > 0 || recentMessages.length > 0);
  }, [messages, widgetMessages]);

  return {
    hasUnreadMessages,
    totalSessions: sessions.length
  };
};


import { useState, useEffect } from 'react';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useChatMessages } from '@/hooks/useChatMessages';

export const useGlobalChat = () => {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { sessions, currentSessionId } = useChatSessions();
  const { messages } = useChatMessages(currentSessionId);

  // For now, we'll implement a simple unread logic
  // This can be enhanced later with proper read/unread tracking
  useEffect(() => {
    // Check if there are any recent AI messages
    const recentMessages = messages.filter(msg => 
      msg.role === 'assistant' && 
      new Date(msg.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
    );
    
    setHasUnreadMessages(recentMessages.length > 0);
  }, [messages]);

  return {
    hasUnreadMessages,
    totalSessions: sessions.length
  };
};

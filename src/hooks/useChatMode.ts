
import { useState, useEffect } from 'react';

export type ChatMode = 'personal' | 'general';

interface ChatModeAnalytics {
  timestamp: string;
  from: ChatMode | null;
  to: ChatMode;
  sessionId?: string;
}

export const useChatMode = () => {
  const [chatMode, setChatMode] = useState<ChatMode>('general'); // Changed default to 'general'

  // Load persisted mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('ai-coach-chat-mode') as ChatMode;
    if (savedMode === 'personal' || savedMode === 'general') {
      setChatMode(savedMode);
    }
  }, []);

  // Track mode changes for analytics
  const changeChatMode = (newMode: ChatMode) => {
    const previousMode = chatMode;
    console.log('🔄 useChatMode: Changing mode from', previousMode, 'to', newMode);
    
    // Update state
    setChatMode(newMode);
    
    // Persist to localStorage
    localStorage.setItem('ai-coach-chat-mode', newMode);
    
    // Fire analytics event
    const analyticsEvent: ChatModeAnalytics = {
      timestamp: new Date().toISOString(),
      from: previousMode,
      to: newMode,
      sessionId: window.crypto?.randomUUID?.() || `session-${Date.now()}`
    };
    
    console.log('🔄 Chat mode changed:', analyticsEvent);
    
    // In a real app, you'd send this to your analytics service
    // analytics.track('chat.modeChanged', analyticsEvent);
    
    // Store in localStorage for potential later upload
    const modeHistory = JSON.parse(localStorage.getItem('chat-mode-history') || '[]');
    modeHistory.push(analyticsEvent);
    
    // Keep only last 50 mode changes
    if (modeHistory.length > 50) {
      modeHistory.splice(0, modeHistory.length - 50);
    }
    
    localStorage.setItem('chat-mode-history', JSON.stringify(modeHistory));
  };

  // Get usage statistics
  const getModeStats = () => {
    const history = JSON.parse(localStorage.getItem('chat-mode-history') || '[]') as ChatModeAnalytics[];
    
    const personalCount = history.filter(h => h.to === 'personal').length;
    const generalCount = history.filter(h => h.to === 'general').length;
    const total = personalCount + generalCount;
    
    return {
      personal: {
        count: personalCount,
        percentage: total > 0 ? Math.round((personalCount / total) * 100) : 0
      },
      general: {
        count: generalCount,
        percentage: total > 0 ? Math.round((generalCount / total) * 100) : 0
      },
      total,
      lastChanged: history.length > 0 ? history[history.length - 1].timestamp : null
    };
  };

  return {
    chatMode,
    changeChatMode,
    getModeStats
  };
};

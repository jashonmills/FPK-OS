
// Type definitions for the AI study chat function
export interface ChatRequest {
  message: string;
  userId: string;
  sessionId: string;
  voiceActive?: boolean;
  metadata?: any;
}

export interface LearningContext {
  profile: {
    name: string;
    currentStreak: number;
    totalXP: number;
  };
  recentActivity: {
    sessionCount: number;
    lastSession: string | null;
    recentAccuracy: number;
  };
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

export interface ToolResult {
  tool_use_id: string;
  content: string;
}

export type QueryMode = 'personal' | 'general';

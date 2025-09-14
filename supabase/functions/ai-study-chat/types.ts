
export interface ClientHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  userId: string;
  sessionId?: string;
  chatMode?: 'personal' | 'general';
  voiceActive?: boolean;
  metadata?: {
    hasInteracted?: boolean;
    timestamp?: string;
    sessionLength?: number;
    userAgent?: string;
    voiceEnabled?: boolean;
    autoRead?: boolean;
    dualAIMode?: boolean;
  };
  clientHistory?: ClientHistoryMessage[];
  originalTopic?: string;
}

export type QueryMode = 'personal' | 'general' | 'mixed';

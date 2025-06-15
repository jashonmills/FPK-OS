
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
}

export type QueryMode = 'personal' | 'general' | 'mixed';

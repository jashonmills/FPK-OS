
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
  dataSource?: 'general' | 'mydata'; // For Personal AI Coach: which data source to use in Free Chat mode
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
  lessonContext?: {
    courseId: string;
    lessonId: number;
    lessonTitle: string;
    lessonContent: string;
  };
}

export type QueryMode = 'personal' | 'general' | 'mixed';
export type DataSource = 'general' | 'mydata';

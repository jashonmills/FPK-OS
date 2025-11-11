
export interface ClientHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  userId: string;
  sessionId?: string;
  chatMode?: 'personal' | 'general' | 'org_admin';
  dataSource?: 'general' | 'mydata'; // For Personal AI Coach: which data source to use in Free Chat mode
  adminMode?: 'educational' | 'org_data'; // For Org Admin: which admin mode
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
  extractTopicOnly?: boolean; // Flag to request topic extraction from chat history
  assignmentContext?: {
    materialContent: string;
    educatorInstructions: string;
    materialTitle: string;
    assignmentId: string;
  };
}

export type QueryMode = 'personal' | 'general' | 'mixed' | 'org_admin';
export type DataSource = 'general' | 'mydata';
export type AdminMode = 'educational' | 'org_data';

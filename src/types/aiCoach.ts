// Core persona types
export type Persona = 'USER' | 'BETTY' | 'AL' | 'NITE_OWL';

// Message interface
export interface Message {
  id: string;
  persona: Persona;
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

// User analytics interface
export interface UserAnalytics {
  totalStudyTime: number;
  sessionsCompleted: number;
  topicsStudied: string[];
  averageScore: number;
  streakDays: number;
}

// Study plan interface
export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  topics: string[];
  estimatedTime: number;
  progress: number;
}

// Saved chat interface
export interface SavedChat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

// Study material interface
export interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'document' | 'link' | 'note';
  uploadedAt: Date;
  size?: number;
}

// AI drill interface
export interface AIDrill {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

// User credit interface
export interface UserCredit {
  userId: string;
  balance: number;
  role: 'user' | 'admin';
}

// Orchestrator request interface
export interface OrchestratorRequest {
  userId: string;
  message: string;
  conversationHistory: Message[];
  context?: string;
}

// Orchestrator response interface
export interface OrchestratorResponse {
  persona: Persona;
  content: string;
  creditsUsed: number;
  remainingCredits: number;
}

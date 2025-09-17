/**
 * AI Coach related type definitions
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  contextTag?: string;
  topics?: string[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createdAt: string;
  reviewCount?: number;
  lastReviewed?: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
}

export interface UserInsights {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  learningStyle?: string;
  progressTrend?: 'improving' | 'stable' | 'declining';
}

export interface ChallengeProps {
  flashcards?: Flashcard[];
  customCards?: Flashcard[];
  onComplete?: (results: QuizResult) => void;
  onProgress?: (progress: number) => void;
}

export interface FileUpload {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadProgress: number;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  processingProgress?: number;
  uploadedAt: string;
  processedAt?: string;
  error?: string;
}

export interface CoachChatProps {
  user?: UserProfile;
  completedSessions?: ChatSession[];
  flashcards?: Flashcard[];
  insights?: UserInsights;
  onLoadChat?: (chatId: string, messages: ChatMessage[]) => void;
  onNewChat?: () => void;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: Record<string, unknown>;
  learningGoals?: string[];
}
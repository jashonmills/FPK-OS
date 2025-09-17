/**
 * Common TypeScript interfaces to replace 'any' types
 */

export interface TrackingData {
  event: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface InteractionEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavigationItem[];
}

export interface FileUploadPayload {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  fileName?: string;
  fileSize?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface QuizResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  timeSpent?: number;
}

export interface ChallengeCard {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface UserPerformanceMetric {
  userId: string;
  metric: string;
  value: number;
  timestamp: Date;
  category?: string;
}

export interface BookData {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publicDomain: boolean;
  coverUrl?: string;
  fileUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface SelectChangeHandler {
  (value: string): void;
}

export interface FormInputChangeHandler {
  (field: string, value: string | number | boolean): void;
}

export interface ThresholdConfig {
  id: string;
  metricName: string;
  warningThreshold: number;
  criticalThreshold: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemHealthMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'healthy' | 'warning' | 'critical';
  lastUpdated: Date;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list' | 'media';
  items?: ContentItem[];
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  type: 'link' | 'document' | 'video' | 'image';
}

export interface GuideContent {
  sections: ContentSection[];
  metadata?: Record<string, unknown>;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  score: number;
  description: string;
  indicators?: string[];
}

export interface RubricContent {
  rubrics: Rubric[];
}

export interface Rubric {
  id: string;
  title: string;
  description?: string;
  criteria: RubricCriterion[];
  totalPoints: number;
}
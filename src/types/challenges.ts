/**
 * Challenge component type definitions
 */

export interface BetaOnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: string;
}

export interface QuickChallenge {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  categories: string[];
}

export interface ChallengeResult {
  challengeId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  accuracy: number;
  completedAt: string;
  difficulty: string;
}

export interface ChallengeMetrics {
  totalCompleted: number;
  averageScore: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  favoriteCategories: string[];
  improvementTrend: 'improving' | 'stable' | 'declining';
}
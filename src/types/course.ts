/**
 * Course-related type definitions
 */

import { ReactComponentElement } from 'react';

export interface CourseLesson {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<LessonProps>;
  unit: string;
  unitColor?: string;
}

export interface LessonProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  trackInteraction?: (event: string, details: InteractionDetails) => void;
}

export interface InteractionDetails {
  lessonId?: number;
  action?: string;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  enrollmentCount: number;
  completionRate: number;
  averageProgress: number;
  lastActive: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedAt?: string;
  enrolledAt: string;
}

export interface CourseProgress {
  lessonId: number;
  completed: boolean;
  progress: number;
  timeSpent?: number;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  lessons: CourseLesson[];
  order: number;
}

export interface CourseMetadata {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  tags: string[];
  prerequisites?: string[];
  learningObjectives: string[];
}
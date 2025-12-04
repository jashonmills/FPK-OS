/**
 * Common interface definitions used across the application
 * Consolidated to reduce duplication and ensure consistency
 */

import { ReactNode, ErrorInfo } from 'react';

// Error Boundary Props - Consolidated interface
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  resetOnPropsChange?: boolean;
}

// Generic component props patterns
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Common loading and error states
export interface AsyncState {
  loading: boolean;
  error: string | null;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp?: string;
}

// Pagination interface
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

// Search and filter interfaces
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// File upload related
export interface FileUploadProgress {
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

// User activity tracking
export interface UserActivity {
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Admin and feedback interfaces
export interface FeedbackData {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: string; // Allow any status string from database
  created_at: string;
  updated_at?: string;
  user_id?: string;
  company?: string;
}

export interface UserFilters {
  role?: string[];
  status?: string[];
  search?: string; // Add search property
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'lesson' | 'quiz' | 'assessment';
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
}

export interface TestResult {
  id: string;
  name?: string;
  test?: string;
  status: 'pass' | 'fail' | 'pending' | 'passed' | 'failed' | 'testing' | 'received';
  message: string;
  duration?: number;
  timestamp: Date;
  category?: string;
  details?: Record<string, unknown>;
}
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
/**
 * Standardized interface definitions for component props
 * This file consolidates commonly used prop interfaces to reduce duplication
 */

import { ReactNode } from 'react';

// Base interfaces for consistent prop patterns
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface TriggerProps {
  trigger?: ReactNode;
}

export interface LoadingProps {
  loading?: boolean;
}

export interface ErrorProps {
  error?: string | null;
  onError?: (error: Error) => void;
}

// Provider component props
export interface ProviderProps {
  children: ReactNode;
}

// Modal and dialog props
export interface ModalProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
}

// Card component props
export interface CardProps extends BaseProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

// Table component props
export interface TableProps<T = any> extends BaseProps {
  data: T[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

// Form component props
export interface FormProps extends BaseProps {
  onSubmit: (data: any) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

// Button-like component props
export interface ActionProps {
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

// Chat and messaging props
export interface ChatProps extends BaseProps {
  sessionId?: string;
  userId?: string;
  onMessageSent?: (message: string) => void;
}

// Analytics and monitoring props
export interface AnalyticsProps {
  trackingId?: string;
  eventCategory?: string;
  metadata?: Record<string, any>;
}

// File upload props
export interface UploadProps extends BaseProps {
  onUpload: (files: File[]) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}
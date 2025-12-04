
import React from 'react';
import EnhancedLoadingProgress from './EnhancedLoadingProgress';
import { EPUBLoadingProgress, EPUBLoadError } from '@/hooks/useOptimizedEPUBLoader';
import { PDFLoadingProgress } from '@/utils/enhancedPdfUtils';
import { EPUBStreamingProgress, EPUBStreamingError } from '@/services/epub/EPUBStreamingTypes';

// Union types for handling both EPUB and PDF
type UnifiedProgress = EPUBLoadingProgress | PDFLoadingProgress;

interface UnifiedError {
  type: 'network' | 'timeout' | 'parsing' | 'rendering' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
}

interface UnifiedLoadingProgressProps {
  title: string;
  progress?: UnifiedProgress | null;
  error?: UnifiedError | EPUBLoadError | string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  type?: 'epub' | 'pdf' | 'general';
}

const UnifiedLoadingProgress: React.FC<UnifiedLoadingProgressProps> = ({
  title,
  progress,
  error,
  onRetry,
  onCancel,
  type = 'general'
}) => {
  // Convert progress to enhanced format (EPUBStreamingProgress)
  const enhancedProgress: EPUBStreamingProgress | null = progress ? {
    stage: (progress as EPUBLoadingProgress).stage === 'downloading' ? 'metadata' as const :
           (progress as EPUBLoadingProgress).stage === 'processing' ? 'structure' as const :
           (progress as EPUBLoadingProgress).stage === 'ready' ? 'ready' as const : 'streaming' as const,
    percentage: progress.percentage,
    message: progress.message,
    bytesLoaded: progress.bytesLoaded,
    totalBytes: progress.totalBytes,
    estimatedTimeRemaining: progress.estimatedTimeRemaining
  } : null;

  // Convert error to enhanced format (EPUBStreamingError)
  const enhancedError: EPUBStreamingError | string | null = error ? 
    typeof error === 'string' ? error : {
      type: error.type as 'network' | 'timeout' | 'parsing' | 'metadata' | 'streaming' | 'unknown',
      message: error.message,
      recoverable: error.recoverable,
      retryCount: error.retryCount
    } : null;

  return (
    <EnhancedLoadingProgress
      title={title}
      progress={enhancedProgress}
      error={enhancedError}
      onRetry={onRetry}
      onCancel={onCancel}
      type={type}
    />
  );
};

export default UnifiedLoadingProgress;

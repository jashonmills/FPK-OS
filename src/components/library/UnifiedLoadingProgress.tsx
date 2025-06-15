
import React from 'react';
import EnhancedLoadingProgress from './EnhancedLoadingProgress';
import { EPUBLoadingProgress, EPUBLoadError } from '@/hooks/useOptimizedEPUBLoader';
import { PDFLoadingProgress } from '@/utils/enhancedPdfUtils';

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
  // Convert progress to enhanced format
  const enhancedProgress = progress ? {
    stage: progress.stage,
    percentage: progress.percentage,
    message: progress.message,
    bytesLoaded: progress.bytesLoaded,
    totalBytes: progress.totalBytes,
    estimatedTimeRemaining: progress.estimatedTimeRemaining,
    totalChapters: (progress as any).totalChapters,
    chaptersLoaded: (progress as any).chaptersLoaded
  } : null;

  return (
    <EnhancedLoadingProgress
      title={title}
      progress={enhancedProgress}
      error={error}
      onRetry={onRetry}
      onCancel={onCancel}
      type={type}
    />
  );
};

export default UnifiedLoadingProgress;

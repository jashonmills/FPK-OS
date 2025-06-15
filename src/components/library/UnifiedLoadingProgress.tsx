
import React from 'react';
import EnhancedLoadingProgress from './EnhancedLoadingProgress';
import { EPUBLoadingProgress, EPUBLoadError } from '@/hooks/useOptimizedEPUBLoader';
import { PDFLoadingProgress } from '@/utils/enhancedPdfUtils';
import { StreamingEPUBProgress, StreamingEPUBError } from '@/hooks/useStreamingProgressConverter';
import { EPUBStreamingProgress, EPUBStreamingError } from '@/services/epub/EPUBStreamingTypes';

// Union types for handling both EPUB and PDF
type UnifiedProgress = EPUBLoadingProgress | PDFLoadingProgress | StreamingEPUBProgress;

interface UnifiedError {
  type: 'network' | 'timeout' | 'parsing' | 'rendering' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
}

interface UnifiedLoadingProgressProps {
  title: string;
  progress?: UnifiedProgress | null;
  error?: UnifiedError | EPUBLoadError | StreamingEPUBError | string | null;
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
    stage: (progress as StreamingEPUBProgress).stage === 'prefetch' ? 'metadata' as const :
           (progress as StreamingEPUBProgress).stage === 'downloading' ? 'structure' as const :
           (progress as StreamingEPUBProgress).stage === 'processing' ? 'preloading' as const :
           (progress as StreamingEPUBProgress).stage as 'streaming' | 'ready',
    percentage: progress.percentage,
    message: progress.message,
    bytesLoaded: progress.bytesLoaded,
    totalBytes: progress.totalBytes,
    estimatedTimeRemaining: progress.estimatedTimeRemaining,
    totalChapters: (progress as any).totalChapters,
    chaptersLoaded: (progress as any).chaptersLoaded || (progress as any).chapterProgress?.loaded
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

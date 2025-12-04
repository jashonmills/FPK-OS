
import { EPUBStreamingProgress, EPUBStreamingError } from '@/services/epub/EPUBStreamingTypes';
import { EPUBLoadingProgress, EPUBLoadError } from '@/hooks/useOptimizedEPUBLoader';

/**
 * Enhanced progress converter with better type handling and additional properties
 */
export const convertStreamingProgress = (
  progress: EPUBStreamingProgress | null
): EPUBLoadingProgress | null => {
  if (!progress) return null;

  // Map streaming stages to loading stages
  let mappedStage: 'downloading' | 'processing' | 'ready';
  switch (progress.stage) {
    case 'metadata':
    case 'structure':
      mappedStage = 'downloading';
      break;
    case 'preloading':
    case 'streaming':
      mappedStage = 'processing';
      break;
    case 'ready':
      mappedStage = 'ready';
      break;
    default:
      mappedStage = 'processing';
  }

  return {
    stage: mappedStage,
    percentage: progress.percentage,
    message: progress.message,
    bytesLoaded: progress.bytesLoaded,
    totalBytes: progress.totalBytes,
    estimatedTimeRemaining: progress.estimatedTimeRemaining
  };
};

/**
 * Enhanced error converter with better error categorization
 */
export const convertStreamingError = (
  error: EPUBStreamingError | null
): EPUBLoadError | null => {
  if (!error) return null;

  // Map streaming error types to standard error types
  let mappedType: 'network' | 'timeout' | 'parsing' | 'rendering' | 'unknown';
  
  switch (error.type) {
    case 'network':
    case 'timeout':
    case 'parsing':
      mappedType = error.type;
      break;
    case 'metadata':
    case 'streaming':
      mappedType = 'parsing';
      break;
    default:
      mappedType = 'unknown';
  }

  return {
    type: mappedType,
    message: error.message,
    recoverable: error.recoverable,
    retryCount: error.retryCount
  };
};

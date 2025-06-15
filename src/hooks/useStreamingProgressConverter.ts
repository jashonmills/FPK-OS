
import { useCallback } from 'react';
import { EPUBStreamingProgress, EPUBStreamingError } from '@/services/epub/EPUBStreamingTypes';

export interface StreamingEPUBProgress {
  stage: 'prefetch' | 'downloading' | 'processing' | 'streaming' | 'ready';
  percentage: number;
  message: string;
  bytesLoaded?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
  totalChapters?: number;
  chaptersLoaded?: number;
  chapterProgress?: {
    loaded: number;
    total: number;
  };
}

export interface StreamingEPUBError {
  type: 'network' | 'timeout' | 'parsing' | 'streaming' | 'unknown';
  message: string;
  recoverable: boolean;
  retryCount: number;
}

export const useStreamingProgressConverter = () => {
  // Convert EPUBStreamingProgress to StreamingEPUBProgress format
  const convertProgress = useCallback((streamingProgress: EPUBStreamingProgress): StreamingEPUBProgress => {
    let stage: StreamingEPUBProgress['stage'] = 'streaming';
    
    switch (streamingProgress.stage) {
      case 'metadata':
        stage = 'prefetch';
        break;
      case 'structure':
        stage = 'processing';
        break;
      case 'preloading':
        stage = 'streaming';
        break;
      case 'streaming':
        stage = 'streaming';
        break;
      case 'ready':
        stage = 'ready';
        break;
    }

    return {
      stage,
      percentage: streamingProgress.percentage,
      message: streamingProgress.message,
      bytesLoaded: streamingProgress.bytesLoaded,
      totalBytes: streamingProgress.totalBytes,
      estimatedTimeRemaining: streamingProgress.estimatedTimeRemaining,
      totalChapters: streamingProgress.totalChapters,
      chaptersLoaded: streamingProgress.chaptersLoaded,
      chapterProgress: streamingProgress.chaptersLoaded && streamingProgress.totalChapters ? {
        loaded: streamingProgress.chaptersLoaded,
        total: streamingProgress.totalChapters
      } : undefined
    };
  }, []);

  // Convert EPUBStreamingError to StreamingEPUBError format
  const convertError = useCallback((streamingError: EPUBStreamingError): StreamingEPUBError => {
    let type: StreamingEPUBError['type'] = 'unknown';
    
    switch (streamingError.type) {
      case 'network':
        type = 'network';
        break;
      case 'timeout':
        type = 'timeout';
        break;
      case 'parsing':
        type = 'parsing';
        break;
      case 'metadata':
      case 'streaming':
        type = 'streaming';
        break;
      default:
        type = 'unknown';
    }

    return {
      type,
      message: streamingError.message,
      recoverable: streamingError.recoverable,
      retryCount: streamingError.retryCount
    };
  }, []);

  return { convertProgress, convertError };
};

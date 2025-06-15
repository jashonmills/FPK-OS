
import React from 'react';

interface ProgressConverterProps {
  progress: any;
  error: any;
}

export const convertStreamingProgress = (progress: any) => {
  if (!progress) return null;
  
  return {
    stage: progress.stage === 'prefetch' ? 'downloading' as const : 
           progress.stage === 'streaming' ? 'processing' as const :
           progress.stage as 'downloading' | 'processing' | 'ready',
    percentage: progress.percentage,
    message: progress.message,
    bytesLoaded: progress.bytesLoaded,
    totalBytes: progress.totalBytes,
    estimatedTimeRemaining: progress.estimatedTimeRemaining
  };
};

export const convertStreamingError = (error: any) => {
  if (!error) return null;
  
  return {
    type: error.type === 'streaming' ? 'network' as const : error.type as 'network' | 'timeout' | 'parsing' | 'unknown',
    message: error.message,
    recoverable: error.recoverable,
    retryCount: error.retryCount
  };
};

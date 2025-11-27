
import { useRef, useCallback } from 'react';
import { StreamingEPUBError } from './useStreamingProgressConverter';

export const useStreamingRetryLogic = (
  maxRetries: number = 2,
  onError: (error: StreamingEPUBError) => void,
  loadFunction: () => Promise<void>
) => {
  const retryCountRef = useRef(0);

  const handleRetryableError = useCallback((error: StreamingEPUBError) => {
    console.error('❌ Enhanced streaming error:', error);
    
    if (error.recoverable && retryCountRef.current < maxRetries) {
      retryCountRef.current++;
      console.log(`🔄 Retrying enhanced streaming... Attempt ${retryCountRef.current}/${maxRetries}`);
      
      setTimeout(() => {
        loadFunction();
      }, 1000 + (retryCountRef.current * 1000));
      return;
    }
    
    onError(error);
  }, [maxRetries, onError, loadFunction]);

  const resetRetryCount = useCallback(() => {
    retryCountRef.current = 0;
  }, []);

  const retryLoad = useCallback(() => {
    resetRetryCount();
    loadFunction();
  }, [resetRetryCount, loadFunction]);

  return {
    retryCountRef,
    handleRetryableError,
    resetRetryCount,
    retryLoad
  };
};

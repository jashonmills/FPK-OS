import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error, retryCount: number) => void;
  onMaxRetriesReached?: (error: Error) => void;
}

interface ErrorRecoveryState {
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
  hasMaxRetriesReached: boolean;
}

export const useErrorRecovery = (options: UseErrorRecoveryOptions = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onMaxRetriesReached
  } = options;

  const [state, setState] = useState<ErrorRecoveryState>({
    isLoading: false,
    error: null,
    retryCount: 0,
    hasMaxRetriesReached: false
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string = 'Operation'
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const attempt = async (attemptNumber: number): Promise<T | null> => {
      try {
        const result = await operation();
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: null,
          retryCount: 0,
          hasMaxRetriesReached: false
        }));
        return result;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        
        console.error(`❌ ${operationName} failed (attempt ${attemptNumber}/${maxRetries}):`, errorObj);
        
        setState(prev => ({ 
          ...prev, 
          error: errorObj, 
          retryCount: attemptNumber 
        }));

        onError?.(errorObj, attemptNumber);

        if (attemptNumber < maxRetries) {
          toast.error(`${operationName} failed`, {
            description: `Retrying in ${retryDelay/1000} seconds... (${attemptNumber}/${maxRetries})`,
          });

          return new Promise(resolve => {
            timeoutRef.current = setTimeout(() => {
              resolve(attempt(attemptNumber + 1));
            }, retryDelay * attemptNumber); // Exponential backoff
          });
        } else {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            hasMaxRetriesReached: true 
          }));
          
          onMaxRetriesReached?.(errorObj);
          
          toast.error(`${operationName} failed permanently`, {
            description: `Maximum retries (${maxRetries}) reached. Please try again later.`,
            duration: 5000
          });
          
          return null;
        }
      }
    };

    return attempt(1);
  }, [maxRetries, retryDelay, onError, onMaxRetriesReached]);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName?: string
  ) => {
    setState(prev => ({ 
      ...prev, 
      retryCount: 0, 
      hasMaxRetriesReached: false,
      error: null
    }));
    
    return executeWithRetry(operation, operationName);
  }, [executeWithRetry]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setState({
      isLoading: false,
      error: null,
      retryCount: 0,
      hasMaxRetriesReached: false
    });
  }, []);

  return {
    ...state,
    executeWithRetry,
    retry,
    reset
  };
};
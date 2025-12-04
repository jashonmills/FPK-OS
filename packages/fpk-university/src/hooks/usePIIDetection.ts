import { useState, useCallback, useMemo } from 'react';
import { detectPII, PIIDetectionResult, maskPII } from '@/utils/piiDetection';

interface UsePIIDetectionOptions {
  enabled?: boolean;
  autoCheck?: boolean;
  debounceMs?: number;
}

interface UsePIIDetectionReturn {
  checkMessage: (text: string) => PIIDetectionResult;
  lastResult: PIIDetectionResult | null;
  hasPII: boolean;
  clearResult: () => void;
  maskText: (text: string) => string;
  acknowledgeWarning: () => void;
  warningAcknowledged: boolean;
}

const EMPTY_RESULT: PIIDetectionResult = {
  hasPII: false,
  matches: [],
  severity: 'none',
  message: ''
};

export function usePIIDetection(options: UsePIIDetectionOptions = {}): UsePIIDetectionReturn {
  const { enabled = true } = options;
  
  const [lastResult, setLastResult] = useState<PIIDetectionResult | null>(null);
  const [warningAcknowledged, setWarningAcknowledged] = useState(false);

  const checkMessage = useCallback((text: string): PIIDetectionResult => {
    if (!enabled || !text.trim()) {
      setLastResult(EMPTY_RESULT);
      return EMPTY_RESULT;
    }
    
    const result = detectPII(text);
    setLastResult(result);
    
    // Reset acknowledgment when new PII is detected
    if (result.hasPII) {
      setWarningAcknowledged(false);
    }
    
    return result;
  }, [enabled]);

  const clearResult = useCallback(() => {
    setLastResult(null);
    setWarningAcknowledged(false);
  }, []);

  const maskText = useCallback((text: string): string => {
    if (!lastResult) return text;
    return maskPII(text, lastResult);
  }, [lastResult]);

  const acknowledgeWarning = useCallback(() => {
    setWarningAcknowledged(true);
  }, []);

  const hasPII = useMemo(() => {
    return lastResult?.hasPII ?? false;
  }, [lastResult]);

  return {
    checkMessage,
    lastResult,
    hasPII,
    clearResult,
    maskText,
    acknowledgeWarning,
    warningAcknowledged
  };
}

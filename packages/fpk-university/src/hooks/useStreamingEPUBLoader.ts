
/**
 * Enhanced Streaming EPUB Loader Hook
 * Now uses refactored components for better maintainability
 */

import { PublicDomainBook } from '@/types/publicDomainBooks';
import { useStreamingEPUBCore } from './useStreamingEPUBCore';

export const useStreamingEPUBLoader = (book: PublicDomainBook) => {
  return useStreamingEPUBCore(book);
};

// Re-export types for backward compatibility
export type {
  StreamingEPUBProgress,
  StreamingEPUBError
} from './useStreamingProgressConverter';

/**
 * Enhanced Streaming EPUB Loader Hook
 * Now uses the refactored EnhancedEPUBStreamingLoader service
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { 
  EnhancedEPUBStreamingLoader, 
  EPUBStreamingProgress, 
  EPUBStreamingError, 
  EPUBMetadata 
} from '@/services/EnhancedEPUBStreamingLoader';
import { indexedDBCache } from '@/services/IndexedDBCacheService';

export interface StreamingEPUBProgress {
  stage: 'prefetch' | 'downloading' | 'processing' | 'streaming' | 'ready';
  percentage: number;
  message: string;
  bytesLoaded?: number;
  totalBytes?: number;
  estimatedTimeRemaining?: number;
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

export const useStreamingEPUBLoader = (book: PublicDomainBook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<StreamingEPUBProgress | null>(null);
  const [error, setError] = useState<StreamingEPUBError | null>(null);
  const [epubInstance, setEpubInstance] = useState<any>(null);
  const [toc, setToc] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<EPUBMetadata | null>(null);
  
  const retryCountRef = useRef(0);
  const loaderRef = useRef<EnhancedEPUBStreamingLoader | null>(null);
  const MAX_RETRIES = 2;

  // Convert streaming progress to legacy format
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
      chapterProgress: streamingProgress.chaptersLoaded && streamingProgress.totalChapters ? {
        loaded: streamingProgress.chaptersLoaded,
        total: streamingProgress.totalChapters
      } : undefined
    };
  }, []);

  // Convert streaming error to legacy format
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

  const getOptimalEPUBUrl = useCallback(() => {
    if (book.storage_url) {
      console.log('📚 Using storage URL for enhanced streaming');
      return book.storage_url;
    }
    
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}&stream=true&enhanced=true`;
    console.log('🔗 Using enhanced streaming proxy URL');
    return proxyUrl;
  }, [book]);

  const loadEPUB = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(null);
      setEpubInstance(null);
      setToc([]);
      setMetadata(null);
      
      console.log('🚀 Starting enhanced streaming EPUB load for:', book.title);
      
      // Create enhanced streaming loader
      loaderRef.current = new EnhancedEPUBStreamingLoader(
        (progress) => setProgress(convertProgress(progress)),
        (error) => {
          const convertedError = convertError(error);
          console.error('❌ Enhanced streaming error:', convertedError);
          
          if (convertedError.recoverable && retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++;
            console.log(`🔄 Retrying enhanced streaming... Attempt ${retryCountRef.current}/${MAX_RETRIES}`);
            
            setTimeout(() => {
              loadEPUB();
            }, 1000 + (retryCountRef.current * 1000));
            return;
          }
          
          setError(convertedError);
          setIsLoading(false);
          setProgress(null);
        }
      );

      const epubUrl = getOptimalEPUBUrl();
      const cacheKey = book.id;
      
      const result = await loaderRef.current.loadEPUB(epubUrl, cacheKey);
      
      if (result.success) {
        setEpubInstance(result.epubInstance);
        
        if (result.metadata) {
          setMetadata(result.metadata);
          setToc(result.metadata.toc || []);
        }
        
        setIsLoading(false);
        setProgress(null);
        retryCountRef.current = 0;
        
        console.log('✅ Enhanced streaming EPUB loading completed successfully');
      }
      
    } catch (err) {
      console.error('❌ Enhanced streaming EPUB loading error:', err);
      
      const streamingError: StreamingEPUBError = {
        type: 'unknown',
        message: err instanceof Error ? err.message : 'Unknown streaming error',
        recoverable: retryCountRef.current < MAX_RETRIES,
        retryCount: retryCountRef.current
      };
      
      if (streamingError.recoverable) {
        retryCountRef.current++;
        setTimeout(() => {
          loadEPUB();
        }, 1000 + (retryCountRef.current * 1000));
        return;
      }
      
      setError(streamingError);
      setIsLoading(false);
      setProgress(null);
    }
  }, [book, convertProgress, convertError, getOptimalEPUBUrl]);

  const retryLoad = useCallback(() => {
    retryCountRef.current = 0;
    setError(null);
    loadEPUB();
  }, [loadEPUB]);

  const abortLoad = useCallback(() => {
    if (loaderRef.current) {
      loaderRef.current.abort();
      loaderRef.current = null;
    }
    setIsLoading(false);
    setProgress(null);
    setError(null);
  }, []);

  const getChapterContent = useCallback(async (chapterHref: string) => {
    if (!loaderRef.current) {
      throw new Error('Enhanced streaming loader not available');
    }
    
    try {
      return await loaderRef.current.getChapterContent(chapterHref);
    } catch (error) {
      console.error('Failed to get enhanced chapter content:', error);
      throw error;
    }
  }, []);

  // Update reading position for smart preloading
  const updateReadingPosition = useCallback((chapterIndex: number, readingSpeed?: number) => {
    if (loaderRef.current) {
      loaderRef.current.updateReadingPosition(chapterIndex, readingSpeed);
    }
  }, []);

  // Get streaming statistics
  const getStreamingStats = useCallback(() => {
    return loaderRef.current?.getStreamingStats() || null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortLoad();
    };
  }, [abortLoad]);

  return {
    isLoading,
    progress,
    error,
    epubInstance,
    toc,
    metadata,
    loadEPUB,
    retryLoad,
    abortLoad,
    getChapterContent,
    updateReadingPosition,
    getStreamingStats
  };
};

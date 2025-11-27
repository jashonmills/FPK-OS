
import { useState, useCallback, useRef, useEffect } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import { 
  EnhancedEPUBStreamingLoader, 
  EPUBMetadata 
} from '@/services/EnhancedEPUBStreamingLoader';
import { StreamingEPUBProgress, StreamingEPUBError, useStreamingProgressConverter } from './useStreamingProgressConverter';
import { useStreamingRetryLogic } from './useStreamingRetryLogic';
import { useEPUBUrlOptimizer } from './useEPUBUrlOptimizer';

export const useStreamingEPUBCore = (book: PublicDomainBook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<StreamingEPUBProgress | null>(null);
  const [error, setError] = useState<StreamingEPUBError | null>(null);
  const [epubInstance, setEpubInstance] = useState<any>(null);
  const [toc, setToc] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<EPUBMetadata | null>(null);
  
  const loaderRef = useRef<EnhancedEPUBStreamingLoader | null>(null);
  const { convertProgress, convertError } = useStreamingProgressConverter();
  const { getOptimalEPUBUrl } = useEPUBUrlOptimizer(book);

  const loadEPUBInternal = useCallback(async () => {
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
        (progress) => {
          console.log('📊 EPUB Loading Progress:', progress);
          setProgress(convertProgress(progress));
        },
        (error) => {
          console.error('❌ EPUB Loading Error:', error);
          const convertedError = convertError(error);
          handleRetryableError(convertedError);
        }
      );

      const epubUrl = getOptimalEPUBUrl();
      const cacheKey = book.id;
      
      console.log('📚 Loading EPUB from URL:', epubUrl);
      console.log('🔑 Using cache key:', cacheKey);
      
      const result = await loaderRef.current.loadEPUB(epubUrl, cacheKey);
      
      if (result.success) {
        console.log('✅ EPUB loading successful:', result);
        setEpubInstance(result.epubInstance);
        
        if (result.metadata) {
          setMetadata(result.metadata);
          setToc(result.metadata.toc || []);
          console.log('📖 Metadata loaded:', {
            title: result.metadata.title,
            chaptersCount: result.metadata.spine.length,
            tocItemsCount: result.metadata.toc.length
          });
        }
        
        setIsLoading(false);
        setProgress(null);
        resetRetryCount();
        
        console.log('✅ Enhanced streaming EPUB loading completed successfully');
      } else {
        console.error('❌ EPUB loading failed:', result.error);
        if (result.error) {
          handleRetryableError(convertError(result.error));
        }
      }
      
    } catch (err) {
      console.error('❌ Enhanced streaming EPUB loading error:', err);
      
      const streamingError: StreamingEPUBError = {
        type: 'unknown',
        message: err instanceof Error ? err.message : 'Unknown streaming error',
        recoverable: retryCountRef.current < 2,
        retryCount: retryCountRef.current
      };
      
      handleRetryableError(streamingError);
    }
  }, [book, convertProgress, convertError, getOptimalEPUBUrl]);

  const {
    retryCountRef,
    handleRetryableError,
    resetRetryCount,
    retryLoad
  } = useStreamingRetryLogic(2, (error) => {
    console.error('❌ Final EPUB loading error:', error);
    setError(error);
    setIsLoading(false);
    setProgress(null);
  }, loadEPUBInternal);

  const abortLoad = useCallback(() => {
    console.log('🛑 Aborting EPUB load');
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
      console.log('📄 Getting chapter content:', chapterHref);
      return await loaderRef.current.getChapterContent(chapterHref);
    } catch (error) {
      console.error('Failed to get enhanced chapter content:', error);
      throw error;
    }
  }, []);

  const updateReadingPosition = useCallback((chapterIndex: number, readingSpeed?: number) => {
    if (loaderRef.current) {
      console.log('📍 Updating reading position:', chapterIndex, readingSpeed);
      loaderRef.current.updateReadingPosition(chapterIndex, readingSpeed);
    }
  }, []);

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
    loadEPUB: loadEPUBInternal,
    retryLoad,
    abortLoad,
    getChapterContent,
    updateReadingPosition,
    getStreamingStats
  };
};

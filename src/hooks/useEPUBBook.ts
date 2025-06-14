
import { useState, useEffect, useRef, useCallback } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';
import type ePub from 'epubjs';

export const useEPUBBook = (book: PublicDomainBook) => {
  const [epubBookInstance, setEpubBookInstance] = useState<ePub.Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [toc, setToc] = useState<any[]>([]);
  
  const retryCountRef = useRef(0);
  const maxRetries = 2;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getEPUBUrl = useCallback(() => {
    if (book.storage_url) {
      console.log('📚 Using local storage URL for book loading:', book.storage_url);
      return book.storage_url;
    }
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}`;
    console.log('🔗 Using proxy URL for book loading:', proxyUrl);
    return proxyUrl;
  }, [book.storage_url, book.epub_url]);

  const waitForBookReady = async (currentEpubBook: ePub.Book) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Book parsing timed out. This book may be too large or complex. Please try again.'));
      }, 30000);
    });
    await Promise.race([currentEpubBook.ready, timeoutPromise]);
  };

  const handleLoadingError = (err: any) => {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load EPUB';
    
    if (errorMessage.includes('timed out') || errorMessage.includes('timeout')) {
      setError('This book is taking too long to load, even after extending the wait time. It might be very large or there could be a temporary issue. Please try again later or select a different book.');
    } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      setError('Network connection issue. Please check your internet connection and try again.');
    } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      setError('This book is not available. Please try selecting a different book.');
    } else {
      setError(`Unable to load "${book.title}". Please try again or select a different book. Details: ${errorMessage}`);
    }
    
    setIsLoading(false);
    setLoadingStep('');
    setLoadingProgress(0);
  };

  const loadEPUB = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setEpubBookInstance(null);
      setToc([]);
      setLoadingStep('Initializing...');
      setLoadingProgress(10);

      console.log('📖 Loading EPUB for:', book.title);

      if (!book.epub_url && !book.storage_url) {
        throw new Error('No EPUB URL available for this book');
      }

      setLoadingStep('Loading EPUB library...');
      setLoadingProgress(20);
      
      const epubModule = await import('epubjs');
      const EPubLib = epubModule.default;
      
      setLoadingStep('Connecting to book server...');
      setLoadingProgress(30);
      
      const epubUrl = getEPUBUrl();
      
      setLoadingStep('Creating EPUB instance...');
      setLoadingProgress(40);
      
      const newEpubBook = EPubLib(epubUrl);
      setEpubBookInstance(newEpubBook);

      setLoadingStep('Loading book content...');
      setLoadingProgress(50);

      await waitForBookReady(newEpubBook);
      console.log('✅ EPUB book ready');

      setLoadingStep('Processing book structure...');
      setLoadingProgress(80);

      try {
        await Promise.race([
          newEpubBook.loaded.navigation.then(() => {
            setToc(newEpubBook.navigation.toc || []);
            console.log('📚 TOC loaded:', newEpubBook.navigation.toc?.length || 0, 'items');
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TOC timeout')), 5000))
        ]);
      } catch (navError) {
        console.warn('⚠️ Could not load table of contents, continuing without it');
        setToc([]);
      }

      setLoadingStep('Ready to read!');
      setLoadingProgress(100);
      
      await delay(300);

      setIsLoading(false);
      setLoadingStep('');
      setLoadingProgress(0);
      retryCountRef.current = 0;
      console.log('✅ EPUB loaded successfully');

    } catch (err) {
      console.error('❌ Error loading EPUB:', err);
      
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const retryDelay = Math.pow(2, retryCountRef.current -1) * 1000;
        console.log(`🔄 Retrying loadEPUB... Attempt ${retryCountRef.current}/${maxRetries}. Waiting ${retryDelay}ms.`);
        setLoadingStep(`Retrying... (${retryCountRef.current}/${maxRetries})`);
        
        await delay(retryDelay);
        loadEPUB();
        return;
      }
      
      handleLoadingError(err);
    }
  }, [book.title, book.epub_url, book.storage_url, getEPUBUrl]);

  useEffect(() => {
    loadEPUB();
    
    return () => {
      if (epubBookInstance && typeof epubBookInstance.destroy === 'function') {
        try {
          console.log('Destroying EPUBBook instance from useEPUBBook cleanup');
          epubBookInstance.destroy();
        } catch (err) {
          console.warn('EPUB book instance cleanup error (non-critical):', err);
        }
      }
    };
  }, [loadEPUB]);

  const retryLoad = useCallback(() => {
    retryCountRef.current = 0;
    setError(null);
    setLoadingStep('Retrying...');
    setLoadingProgress(0);
    loadEPUB();
  }, [loadEPUB]);

  return {
    epubBookInstance,
    isLoading,
    error,
    loadingStep,
    loadingProgress,
    toc,
    retryLoad,
  };
};

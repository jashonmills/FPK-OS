
import { useCallback } from 'react';
import { PublicDomainBook } from '@/types/publicDomainBooks';

export const useEPUBUrlOptimizer = (book: PublicDomainBook) => {
  const getOptimalEPUBUrl = useCallback(() => {
    if (book.storage_url) {
      console.log('📚 Using storage URL for enhanced streaming');
      return book.storage_url;
    }
    
    const proxyUrl = `https://zgcegkmqfgznbpdplscz.supabase.co/functions/v1/epub-proxy?url=${encodeURIComponent(book.epub_url)}&stream=true&enhanced=true`;
    console.log('🔗 Using enhanced streaming proxy URL');
    return proxyUrl;
  }, [book]);

  return { getOptimalEPUBUrl };
};

import { pdfjs } from 'react-pdf';

/**
 * Available CDN sources for PDF.js worker
 */
const WORKER_URLS = [
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`,
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`,
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`
];

/**
 * Simple PDF worker status check
 */
export const isPDFWorkerReady = (): boolean => {
  const isReady = !!pdfjs.GlobalWorkerOptions.workerSrc;
  console.log('🔍 PDF Worker Status:', {
    workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    isReady,
    version: pdfjs.version
  });
  return isReady;
};

/**
 * Get current worker configuration info
 */
export const getWorkerInfo = () => {
  return {
    workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    version: pdfjs.version,
    isConfigured: !!pdfjs.GlobalWorkerOptions.workerSrc
  };
};

/**
 * Reinitialize worker with fallback strategy
 */
export const reinitializeWorker = async () => {
  console.log('🔄 Reinitializing PDF.js worker with fallback...');
  
  for (const url of WORKER_URLS) {
    try {
      console.log(`🧪 Testing worker URL: ${url}`);
      
      // Test if the URL is accessible
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      
      if (response.ok) {
        pdfjs.GlobalWorkerOptions.workerSrc = url;
        console.log(`✅ Worker successfully configured with: ${url}`);
        return true;
      }
    } catch (error) {
      console.warn(`❌ Failed to access worker URL: ${url}`, error);
    }
  }
  
  console.error('❌ All worker URLs failed. PDF functionality may not work.');
  return false;
};

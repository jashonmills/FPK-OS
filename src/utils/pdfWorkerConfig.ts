
import { pdfjs } from 'react-pdf';

/**
 * Available CDN sources for PDF.js worker (version 4.4.168)
 */
const WORKER_URLS = [
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
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
 * Enhanced worker reinitialization with proper error handling
 */
export const reinitializeWorker = async (): Promise<boolean> => {
  console.log('🔄 Reinitializing PDF.js worker with enhanced fallback...');
  
  for (const url of WORKER_URLS) {
    try {
      console.log(`🧪 Testing worker URL: ${url}`);
      
      // Test if the URL is accessible with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { 
        method: 'HEAD', 
        mode: 'cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        pdfjs.GlobalWorkerOptions.workerSrc = url;
        console.log(`✅ Worker successfully configured with: ${url}`);
        return true;
      }
    } catch (error) {
      console.warn(`❌ Failed to access worker URL: ${url}`, error);
      continue;
    }
  }
  
  // Enhanced fallback: try to create a data URL with worker content
  try {
    console.log('🔄 Attempting data URL fallback...');
    const workerContent = await fetch(WORKER_URLS[0])
      .then(response => response.text());
    
    const workerBlob = new Blob([workerContent], { type: 'application/javascript' });
    const dataUrl = URL.createObjectURL(workerBlob);
    
    pdfjs.GlobalWorkerOptions.workerSrc = dataUrl;
    console.log('✅ Worker configured with data URL fallback');
    return true;
  } catch (error) {
    console.error('❌ Data URL fallback failed:', error);
  }
  
  console.error('❌ All worker URLs and fallbacks failed. PDF functionality may not work.');
  return false;
};

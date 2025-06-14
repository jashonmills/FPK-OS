
import { pdfjs } from 'react-pdf';

// Use the version that matches react-pdf's expectation
const PDFJS_VERSION = '4.8.69';

/**
 * Available CDN sources for PDF.js worker using the correct version
 */
const WORKER_URLS = [
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`,
  `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`,
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`
];

/**
 * Simple PDF worker status check
 */
export const isPDFWorkerReady = (): boolean => {
  const isReady = !!pdfjs.GlobalWorkerOptions.workerSrc;
  console.log('🔍 PDF Worker Status:', {
    workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    isReady,
    reactPdfVersion: pdfjs.version,
    configuredVersion: PDFJS_VERSION
  });
  return isReady;
};

/**
 * Get current worker configuration info
 */
export const getWorkerInfo = () => {
  return {
    workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    reactPdfVersion: pdfjs.version,
    configuredVersion: PDFJS_VERSION,
    isConfigured: !!pdfjs.GlobalWorkerOptions.workerSrc
  };
};

/**
 * Simple worker reinitialization using the correct version
 */
export const reinitializeWorker = async (): Promise<boolean> => {
  console.log('🔄 Reinitializing PDF.js worker with correct version...');
  
  // Try each URL with the correct version
  for (const url of WORKER_URLS) {
    try {
      console.log(`🧪 Testing worker URL: ${url}`);
      
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      
      if (response.ok) {
        pdfjs.GlobalWorkerOptions.workerSrc = url;
        console.log(`✅ Worker configured successfully with: ${url}`);
        return true;
      } else {
        console.warn(`❌ URL returned ${response.status}: ${url}`);
      }
    } catch (error) {
      console.warn(`❌ URL failed: ${url}`, error);
    }
  }
  
  console.error('❌ All worker URLs failed. PDF functionality may not work.');
  return false;
};


import { pdfjs } from 'react-pdf';

/**
 * Reliable PDF.js configuration with local worker files
 */
export const initializeReliablePDF = (): boolean => {
  try {
    // Use local worker first since CDNs are unreliable
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    
    console.log('✅ Local PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
    return true;
  } catch (error) {
    console.error('❌ Failed to configure local PDF.js worker:', error);
    // Only try CDN as fallback if local fails
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.min.js';
      console.log('✅ Using CDN PDF.js worker fallback');
      return true;
    } catch (fallbackError) {
      console.error('❌ All PDF worker options failed:', fallbackError);
      return false;
    }
  }
};

/**
 * Check if PDF worker is properly configured
 */
export const isPDFWorkerReady = (): boolean => {
  return !!pdfjs.GlobalWorkerOptions.workerSrc;
};

/**
 * Get PDF worker status for debugging
 */
export const getPDFWorkerStatus = () => {
  return {
    workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    isConfigured: isPDFWorkerReady(),
    version: pdfjs.version,
    type: 'local_worker_priority'
  };
};

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  initializeReliablePDF();
}

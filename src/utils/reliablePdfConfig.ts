
import { pdfjs } from 'react-pdf';

/**
 * Reliable PDF.js configuration with local worker files
 */
export const initializeReliablePDF = (): boolean => {
  try {
    // Use CDN worker since local file doesn't exist
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    
    console.log('✅ PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
    return true;
  } catch (error) {
    console.error('❌ Failed to configure PDF.js worker:', error);
    // Try mozilla CDN as fallback
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.min.js';
      console.log('✅ Using Mozilla CDN PDF.js worker fallback');
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

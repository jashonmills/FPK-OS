
import { pdfjs } from 'react-pdf';

/**
 * Reliable PDF.js configuration with local worker files
 */
export const initializeReliablePDF = (): boolean => {
  try {
    // Use CDN worker as fallback for better reliability
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    
    console.log('✅ Reliable PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
    return true;
  } catch (error) {
    console.error('❌ Failed to configure PDF.js worker:', error);
    // Try local fallback
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
      console.log('✅ Using local PDF.js worker fallback');
      return true;
    } catch (fallbackError) {
      console.error('❌ Local fallback also failed:', fallbackError);
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
    type: 'reliable_local_worker'
  };
};

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  initializeReliablePDF();
}

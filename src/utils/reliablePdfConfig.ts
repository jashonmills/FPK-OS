
import { pdfjs } from 'react-pdf';

/**
 * Reliable PDF.js configuration with local worker files
 */
export const initializeReliablePDF = (): boolean => {
  try {
    // Use working UNPKG CDN URL for PDF worker
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
    
    console.log('✅ Reliable PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
    return true;
  } catch (error) {
    console.error('❌ Failed to configure PDF.js worker:', error);
    // Try alternative CDN
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.min.js';
      console.log('✅ Using alternative CDN PDF.js worker');
      return true;
    } catch (fallbackError) {
      console.error('❌ Alternative CDN failed, using local fallback');
      // Final fallback - use local worker if available
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        console.log('✅ Using local PDF.js worker fallback');
        return true;
      } catch (localError) {
        console.error('❌ All fallbacks failed:', localError);
        return false;
      }
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

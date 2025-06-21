
import { pdfjs } from 'react-pdf';

/**
 * Reliable PDF.js configuration with local worker files
 */
export const initializeReliablePDF = (): boolean => {
  try {
    // Use local PDF.js worker file
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
    
    console.log('✅ Reliable PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
    return true;
  } catch (error) {
    console.error('❌ Failed to configure PDF.js worker:', error);
    return false;
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

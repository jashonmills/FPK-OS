
import { pdfjs } from 'react-pdf';

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

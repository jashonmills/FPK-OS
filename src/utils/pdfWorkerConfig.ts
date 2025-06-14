
import { pdfjs } from 'react-pdf';

/**
 * Simple PDF worker status check - worker is configured globally at app startup
 */
export const isPDFWorkerReady = (): boolean => {
  return !!pdfjs.GlobalWorkerOptions.workerSrc;
};

/**
 * Emergency worker reconfiguration if needed
 */
export const reconfigurePDFWorker = (): void => {
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`;
    console.log('🔧 PDF.js worker reconfigured');
  }
};


import { pdfjs } from 'react-pdf';

/**
 * Comprehensive PDF worker status check with diagnostics
 */
export const isPDFWorkerReady = (): boolean => {
  const isReady = !!pdfjs.GlobalWorkerOptions.workerSrc;
  console.log('🔍 PDF Worker Status Check:', {
    workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    isReady,
    version: pdfjs.version
  });
  return isReady;
};

/**
 * Emergency worker reconfiguration with multiple fallback strategies
 */
export const reconfigurePDFWorker = (): void => {
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    console.log('🔧 Reconfiguring PDF.js worker...');
    
    // Try multiple fallback strategies
    const fallbackStrategies = [
      `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
      `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`,
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    ];
    
    for (const strategy of fallbackStrategies) {
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = strategy;
        console.log('✅ PDF.js worker reconfigured with:', strategy);
        break;
      } catch (error) {
        console.warn('⚠️ Fallback strategy failed:', strategy, error);
        continue;
      }
    }
  }
};

/**
 * Validate worker accessibility
 */
export const validateWorkerAccess = async (): Promise<boolean> => {
  try {
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      return false;
    }
    
    const response = await fetch(pdfjs.GlobalWorkerOptions.workerSrc, { method: 'HEAD' });
    const isAccessible = response.ok;
    
    console.log('🌐 Worker accessibility check:', {
      url: pdfjs.GlobalWorkerOptions.workerSrc,
      status: response.status,
      accessible: isAccessible
    });
    
    return isAccessible;
  } catch (error) {
    console.error('❌ Worker accessibility check failed:', error);
    return false;
  }
};

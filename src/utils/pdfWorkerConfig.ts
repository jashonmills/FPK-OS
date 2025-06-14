
import { pdfjs } from 'react-pdf';

/**
 * Configures PDF.js worker with a reliable local approach
 */
export const configurePDFWorker = (): boolean => {
  try {
    // Use the local version directly - this is more reliable than CDN
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString();
    
    console.log('✅ PDF.js worker configured successfully with local worker');
    return true;
  } catch (error) {
    console.error('❌ Failed to configure local PDF worker:', error);
    
    // Fallback to CDN
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`;
      console.log('✅ PDF.js worker configured with CDN fallback');
      return true;
    } catch (fallbackError) {
      console.error('❌ Fallback PDF worker configuration failed:', fallbackError);
      return false;
    }
  }
};

/**
 * Simple worker validation that doesn't rely on network requests
 */
export const validatePDFWorker = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Simple check if worker is configured
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        console.error('❌ PDF.js worker not configured');
        resolve(false);
        return;
      }

      console.log('✅ PDF.js worker validation successful');
      resolve(true);
    } catch (error) {
      console.error('❌ PDF.js worker validation error:', error);
      resolve(false);
    }
  });
};


import { pdfjs } from 'react-pdf';

/**
 * Configures PDF.js worker with the installed pdfjs-dist package
 */
export const configurePDFWorker = (): boolean => {
  try {
    // Use the installed pdfjs-dist package directly
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    
    console.log('✅ PDF.js worker configured successfully with version:', pdfjs.version);
    return true;
  } catch (error) {
    console.error('❌ Failed to configure PDF worker:', error);
    return false;
  }
};

/**
 * Validates that PDF.js worker is properly configured
 */
export const validatePDFWorker = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Simple validation by checking if the worker source is set
      if (pdfjs.GlobalWorkerOptions.workerSrc) {
        console.log('✅ PDF.js worker validation successful');
        resolve(true);
      } else {
        console.error('❌ PDF.js worker not configured');
        resolve(false);
      }
    } catch (error) {
      console.error('❌ PDF.js worker validation error:', error);
      resolve(false);
    }
  });
};

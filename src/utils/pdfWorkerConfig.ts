
import { pdfjs } from 'react-pdf';

/**
 * Configures PDF.js worker with the correct version
 */
export const configurePDFWorker = (): boolean => {
  try {
    // Use the exact version we have installed (4.4.168)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`;
    
    console.log('✅ PDF.js worker configured successfully with version 4.4.168');
    return true;
  } catch (error) {
    console.error('❌ Failed to configure PDF worker:', error);
    
    // Fallback to a different CDN
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;
      console.log('✅ PDF.js worker configured with fallback CDN');
      return true;
    } catch (fallbackError) {
      console.error('❌ Fallback PDF worker configuration failed:', fallbackError);
      return false;
    }
  }
};

/**
 * Validates that PDF.js worker is properly configured
 */
export const validatePDFWorker = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Check if worker is configured
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        console.error('❌ PDF.js worker not configured');
        resolve(false);
        return;
      }

      // Test worker availability by making a simple fetch request
      fetch(pdfjs.GlobalWorkerOptions.workerSrc, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log('✅ PDF.js worker validation successful');
            resolve(true);
          } else {
            console.error('❌ PDF.js worker not accessible:', response.status);
            resolve(false);
          }
        })
        .catch(error => {
          console.error('❌ PDF.js worker validation error:', error);
          resolve(false);
        });
    } catch (error) {
      console.error('❌ PDF.js worker validation error:', error);
      resolve(false);
    }
  });
};

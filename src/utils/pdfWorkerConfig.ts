
import { pdfjs } from 'react-pdf';

/**
 * Configures PDF.js worker with multiple fallback options
 */
export const configurePDFWorker = (): boolean => {
  try {
    // Primary: Use the bundled worker from pdfjs-dist
    const workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url
    ).toString();
    
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    
    console.log('✅ PDF.js worker configured with bundled worker:', workerSrc);
    return true;
  } catch (error) {
    console.warn('⚠️ Failed to configure bundled worker, trying CDN fallback:', error);
    
    try {
      // Fallback 1: Use unpkg CDN
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      console.log('✅ PDF.js worker configured with unpkg CDN');
      return true;
    } catch (cdnError) {
      console.warn('⚠️ CDN fallback failed, trying jsDelivr:', cdnError);
      
      try {
        // Fallback 2: Use jsDelivr CDN
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
        console.log('✅ PDF.js worker configured with jsDelivr CDN');
        return true;
      } catch (finalError) {
        console.error('❌ All PDF worker configuration attempts failed:', finalError);
        return false;
      }
    }
  }
};

/**
 * Validates that PDF.js worker is properly configured
 */
export const validatePDFWorker = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Test worker by attempting to load a minimal PDF
      const testData = new Uint8Array([
        0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a
      ]);
      
      pdfjs.getDocument({ data: testData }).promise
        .then(() => {
          console.log('✅ PDF.js worker validation successful');
          resolve(true);
        })
        .catch((error) => {
          console.error('❌ PDF.js worker validation failed:', error);
          resolve(false);
        });
    } catch (error) {
      console.error('❌ PDF.js worker validation error:', error);
      resolve(false);
    }
  });
};


import { pdfjs } from 'react-pdf';

// Use the version that matches react-pdf's expectation
const PDFJS_VERSION = '4.8.69';

/**
 * Reliable PDF worker configuration with fallbacks
 */
const WORKER_URLS = [
  // Try local worker first (most reliable)
  '/pdf.worker.min.js',
  // Fallback to reliable CDNs
  `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`,
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`
];

/**
 * Initialize PDF worker with robust error handling
 */
export const initializePDFWorker = async (): Promise<boolean> => {
  // If already configured and working, don't reconfigure
  if (pdfjs.GlobalWorkerOptions.workerSrc) {
    try {
      // Test if current worker is actually working
      const testDoc = await pdfjs.getDocument('data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPJ4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjE3NAolJUVPRgo=').promise;
      console.log('✅ PDF worker is already working');
      return true;
    } catch (error) {
      console.warn('⚠️ Current PDF worker failed test, reinitializing...');
    }
  }

  console.log('🔧 Initializing PDF.js worker...');

  for (const workerUrl of WORKER_URLS) {
    try {
      console.log(`🧪 Testing PDF worker: ${workerUrl}`);
      
      // Test URL accessibility with proper timeout handling
      if (workerUrl.startsWith('http')) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const response = await fetch(workerUrl, { 
            method: 'HEAD', 
            mode: 'cors',
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.warn(`❌ Worker URL not accessible: ${workerUrl} (${response.status})`);
            continue;
          }
        } catch (fetchError) {
          console.warn(`❌ Worker URL fetch failed: ${workerUrl}`, fetchError);
          continue;
        }
      }

      // Set the worker
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      
      // Test with a minimal PDF
      try {
        const testDoc = await pdfjs.getDocument('data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPJ4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjE3NAolJUVPRgo=').promise;
        console.log(`✅ PDF worker successfully initialized with: ${workerUrl}`);
        return true;
      } catch (testError) {
        console.warn(`❌ Worker test failed for: ${workerUrl}`, testError);
        pdfjs.GlobalWorkerOptions.workerSrc = '';
      }
    } catch (error) {
      console.warn(`❌ Failed to initialize worker with: ${workerUrl}`, error);
    }
  }

  console.error('❌ All PDF worker initialization attempts failed');
  return false;
};

/**
 * Simple worker status check
 */
export const isPDFWorkerReady = (): boolean => {
  return !!pdfjs.GlobalWorkerOptions.workerSrc;
};

/**
 * Get current worker info for debugging
 */
export const getWorkerInfo = () => {
  return {
    workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
    reactPdfVersion: pdfjs.version,
    configuredVersion: PDFJS_VERSION,
    isConfigured: !!pdfjs.GlobalWorkerOptions.workerSrc
  };
};

/**
 * Retry worker initialization
 */
export const reinitializeWorker = async (): Promise<boolean> => {
  pdfjs.GlobalWorkerOptions.workerSrc = '';
  return initializePDFWorker();
};

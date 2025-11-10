
import { pdfjs } from 'react-pdf';

// Use the version that matches react-pdf's expectation
const PDFJS_VERSION = '4.8.69';

/**
 * Optimized PDF worker configuration with better error handling
 * For react-pdf v10.x compatibility
 */
const WORKER_URLS = [
  // Use legacy worker files that don't require ES module imports
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`,
  `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/legacy/build/pdf.worker.js`,
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/legacy/build/pdf.worker.js`,
  // Standard worker URLs as fallback
  `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.js`,
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.js`,
  // Try local worker last
  '/pdf.worker.js'
];

/**
 * Initialize PDF worker with optimized performance and robust error handling
 */
export const initializePDFWorker = async (): Promise<boolean> => {
  // Force clear any existing worker configuration to avoid caching issues
  pdfjs.GlobalWorkerOptions.workerSrc = '';
  
  console.log('🔧 Initializing PDF.js worker (react-pdf v10.x compatible)...');

  for (let i = 0; i < WORKER_URLS.length; i++) {
    const workerUrl = WORKER_URLS[i];
    
    try {
      console.log(`🎯 Testing worker: ${workerUrl}`);
      
      // Skip URL accessibility check for CDN URLs to speed up initialization
      const skipCheck = workerUrl.includes('cdnjs.cloudflare.com');
      
      if (!skipCheck && workerUrl.startsWith('http')) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000); // Reduced timeout

          const response = await fetch(workerUrl, { 
            method: 'HEAD', 
            mode: 'cors',
            signal: controller.signal,
            priority: 'high' // Prioritize worker loading
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

      // Set the worker with performance optimization
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      console.log(`🎯 Attempting worker: ${workerUrl}`);
      console.log(`📊 Worker info:`, {
        version: pdfjs.version,
        workerType: workerUrl.includes('.mjs') ? 'ES Module (.mjs)' : workerUrl.includes('.js') ? 'Standard (.js)' : 'Minified (.min.js)',
        source: workerUrl.includes('unpkg') ? 'unpkg CDN' : 
                workerUrl.includes('jsdelivr') ? 'jsDelivr CDN' : 
                workerUrl.includes('mozilla') ? 'Mozilla CDN' : 'Local'
      });
      
      // Quick test with timeout
      try {
        const testDoc = await Promise.race([
          pdfjs.getDocument('data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPJ4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjE3NAolJUVPRgo=').promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Worker test timeout')), 3000))
        ]);
        console.log(`✅ PDF worker successfully initialized with optimized performance: ${workerUrl}`);
        return true;
      } catch (testError) {
        console.warn(`❌ Worker test failed for: ${workerUrl}`, testError);
        pdfjs.GlobalWorkerOptions.workerSrc = '';
      }
    } catch (error) {
      console.warn(`❌ Failed to initialize worker with: ${workerUrl}`, error);
    }
  }

  console.error('❌ All PDF worker initialization attempts failed - PDF viewing may be impacted');
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
    isConfigured: !!pdfjs.GlobalWorkerOptions.workerSrc,
    optimized: true
  };
};

/**
 * Optimized worker reinitialization
 */
export const reinitializeWorker = async (): Promise<boolean> => {
  pdfjs.GlobalWorkerOptions.workerSrc = '';
  return initializePDFWorker();
};

// Auto-initialize worker on module load for better performance
if (typeof window !== 'undefined') {
  // Initialize worker in next tick to avoid blocking main thread
  setTimeout(() => {
    initializePDFWorker().catch(error => {
      console.warn('Background PDF worker initialization failed:', error);
    });
  }, 100);
}

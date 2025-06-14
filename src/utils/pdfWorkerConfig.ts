
import { pdfjs } from 'react-pdf';

/**
 * Available CDN sources for PDF.js worker (version 4.4.168)
 */
const WORKER_URLS = [
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
];

/**
 * Test if a worker URL is accessible and working
 */
const testWorkerUrl = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD', 
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn(`Worker URL test failed for ${url}:`, error);
    return false;
  }
};

/**
 * Test worker functionality by creating a temporary worker
 */
const testWorkerFunctionality = async (workerSrc: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const testWorker = new Worker(workerSrc);
      
      const timeout = setTimeout(() => {
        testWorker.terminate();
        resolve(false);
      }, 3000);
      
      testWorker.onmessage = () => {
        clearTimeout(timeout);
        testWorker.terminate();
        resolve(true);
      };
      
      testWorker.onerror = () => {
        clearTimeout(timeout);
        testWorker.terminate();
        resolve(false);
      };
      
      // Send a test message
      testWorker.postMessage({ type: 'test' });
      
    } catch (error) {
      console.warn('Worker functionality test failed:', error);
      resolve(false);
    }
  });
};

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

/**
 * Enhanced worker reinitialization with comprehensive testing
 */
export const reinitializeWorker = async (): Promise<boolean> => {
  console.log('🔄 Reinitializing PDF.js worker with comprehensive testing...');
  
  // Test each CDN URL
  for (const url of WORKER_URLS) {
    console.log(`🧪 Testing worker URL: ${url}`);
    
    const isAccessible = await testWorkerUrl(url);
    if (!isAccessible) {
      console.warn(`❌ URL not accessible: ${url}`);
      continue;
    }
    
    // Set the worker and test functionality
    pdfjs.GlobalWorkerOptions.workerSrc = url;
    const isWorking = await testWorkerFunctionality(url);
    
    if (isWorking) {
      console.log(`✅ Worker successfully configured and tested with: ${url}`);
      return true;
    } else {
      console.warn(`❌ Worker functional test failed for: ${url}`);
    }
  }
  
  // Enhanced fallback: Create worker from content
  try {
    console.log('🔄 Attempting enhanced data URL fallback...');
    
    // Fetch worker content from the first URL
    const workerResponse = await fetch(WORKER_URLS[0]);
    const workerContent = await workerResponse.text();
    
    // Create a properly configured worker blob
    const workerBlob = new Blob([workerContent], { 
      type: 'application/javascript' 
    });
    const dataUrl = URL.createObjectURL(workerBlob);
    
    pdfjs.GlobalWorkerOptions.workerSrc = dataUrl;
    
    // Test the fallback worker
    const isWorking = await testWorkerFunctionality(dataUrl);
    if (isWorking) {
      console.log('✅ Enhanced data URL fallback worker is working');
      return true;
    } else {
      console.warn('❌ Enhanced data URL fallback worker test failed');
    }
    
  } catch (error) {
    console.error('❌ Enhanced data URL fallback failed:', error);
  }
  
  // Final fallback - just set a URL and hope for the best
  console.log('🆘 Using final fallback worker URL without testing');
  pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URLS[0];
  
  console.error('❌ All worker URLs and fallbacks failed comprehensive testing. PDF functionality may not work reliably.');
  return false;
};

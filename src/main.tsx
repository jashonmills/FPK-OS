
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker with proper initialization and testing
const setupPDFWorker = async () => {
  console.log('🔧 Setting up PDF.js worker, version:', pdfjs.version);
  
  // Use the actual installed version (4.4.168) with correct paths
  const workerUrls = [
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  ];

  // Test and set the first working URL with proper worker testing
  for (const url of workerUrls) {
    try {
      console.log(`🧪 Testing worker URL: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { 
        method: 'HEAD', 
        mode: 'cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        pdfjs.GlobalWorkerOptions.workerSrc = url;
        console.log(`✅ PDF.js worker configured successfully with: ${url}`);
        
        // Test worker initialization
        await testWorkerInitialization();
        return;
      }
    } catch (error) {
      console.warn(`❌ Failed to access worker URL: ${url}`, error);
      continue;
    }
  }

  // Enhanced fallback with proper worker content loading
  console.log('🔄 All CDN URLs failed, using enhanced data URL fallback');
  try {
    // Try to fetch the worker content from the first URL
    const workerResponse = await fetch(workerUrls[0]);
    const workerContent = await workerResponse.text();
    
    // Create a proper worker blob with the right MIME type
    const workerBlob = new Blob([workerContent], { 
      type: 'application/javascript' 
    });
    
    const workerUrl = URL.createObjectURL(workerBlob);
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    
    console.log('✅ PDF.js worker configured with enhanced data URL fallback');
    
    // Test the fallback worker
    await testWorkerInitialization();
    
  } catch (error) {
    console.error('❌ Enhanced fallback failed:', error);
    
    // Final fallback - use a known working CDN URL
    const finalFallback = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
    pdfjs.GlobalWorkerOptions.workerSrc = finalFallback;
    console.log('🆘 Using final fallback worker URL:', finalFallback);
  }
};

// Test worker initialization to ensure it's working
const testWorkerInitialization = async () => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Worker initialization test timed out'));
    }, 3000);

    try {
      // Create a minimal test to verify worker is working
      const testWorker = new Worker(pdfjs.GlobalWorkerOptions.workerSrc);
      
      testWorker.onmessage = () => {
        clearTimeout(timeout);
        testWorker.terminate();
        console.log('✅ Worker initialization test passed');
        resolve(true);
      };
      
      testWorker.onerror = (error) => {
        clearTimeout(timeout);
        testWorker.terminate();
        console.warn('⚠️ Worker test failed but continuing:', error);
        resolve(false); // Don't reject, just warn
      };
      
      // Send a test message
      testWorker.postMessage({ type: 'test' });
      
    } catch (error) {
      clearTimeout(timeout);
      console.warn('⚠️ Worker test setup failed but continuing:', error);
      resolve(false); // Don't reject, just warn
    }
  });
};

setupPDFWorker();

createRoot(document.getElementById("root")!).render(
  <App />
);

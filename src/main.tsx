
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker with correct version and fallback strategy
const setupPDFWorker = async () => {
  console.log('🔧 Setting up PDF.js worker, version:', pdfjs.version);
  
  // Use the actual installed version (4.4.168) with correct paths
  const workerUrls = [
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
  ];

  // Test and set the first working URL
  for (const url of workerUrls) {
    try {
      console.log(`🧪 Testing worker URL: ${url}`);
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      if (response.ok) {
        pdfjs.GlobalWorkerOptions.workerSrc = url;
        console.log(`✅ PDF.js worker configured successfully with: ${url}`);
        return;
      }
    } catch (error) {
      console.warn(`❌ Failed to access worker URL: ${url}`, error);
      continue;
    }
  }

  // Fallback: Use data URL with embedded worker
  console.log('🔄 All CDN URLs failed, using data URL fallback');
  try {
    const workerBlob = await fetch(`https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`)
      .then(response => response.text())
      .then(text => new Blob([text], { type: 'application/javascript' }));
    
    const workerUrl = URL.createObjectURL(workerBlob);
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    console.log('✅ PDF.js worker configured with data URL fallback');
  } catch (error) {
    console.error('❌ All worker configuration methods failed:', error);
    // Set a basic fallback that might work
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }
};

setupPDFWorker();

createRoot(document.getElementById("root")!).render(
  <App />
);

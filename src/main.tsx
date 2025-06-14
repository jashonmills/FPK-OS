
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker with fallback strategy
const setupPDFWorker = () => {
  const workerUrls = [
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.js',
    'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js'
  ];

  // Try the first URL (most reliable)
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrls[0];
  
  console.log('✅ PDF.js worker configured with jsdelivr CDN:', pdfjs.GlobalWorkerOptions.workerSrc);
  console.log('📖 PDF.js version:', pdfjs.version);
  console.log('🔄 Fallback URLs available:', workerUrls.slice(1));
};

setupPDFWorker();

createRoot(document.getElementById("root")!).render(
  <App />
);

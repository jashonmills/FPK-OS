
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker with fallback strategy
const setupPDFWorker = () => {
  const workerUrls = [
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`,
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`
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

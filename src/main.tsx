
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker using CDN with fixed version (most reliable approach)
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js';

console.log('✅ PDF.js worker configured via CDN:', pdfjs.GlobalWorkerOptions.workerSrc);
console.log('📖 PDF.js version:', pdfjs.version);

createRoot(document.getElementById("root")!).render(
  <App />
);

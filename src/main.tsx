
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Simple, reliable PDF.js worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

console.log('✅ PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
console.log('📖 PDF.js version:', pdfjs.version);

createRoot(document.getElementById("root")!).render(
  <App />
);


import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Use Vite's asset handling to get the worker URL
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Configure PDF.js worker using Vite's asset system
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

console.log('✅ PDF.js worker configured via Vite assets:', pdfjs.GlobalWorkerOptions.workerSrc);
console.log('📖 PDF.js version:', pdfjs.version);

createRoot(document.getElementById("root")!).render(
  <App />
);

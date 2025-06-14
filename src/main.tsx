
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Use the version that matches react-pdf's expectation
const PDFJS_VERSION = '4.8.69';

console.log('🔧 Setting up PDF.js worker');
console.log('📦 React-PDF version:', pdfjs.version);
console.log('📦 Using pdfjs-dist version:', PDFJS_VERSION);

// Configure worker with the correct version that react-pdf expects
const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

console.log('✅ PDF.js worker configured with:', workerUrl);

createRoot(document.getElementById("root")!).render(
  <App />
);

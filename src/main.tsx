
import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Use the actual installed pdfjs-dist version instead of react-pdf's version
const ACTUAL_PDFJS_VERSION = '4.4.168';

console.log('🔧 Setting up PDF.js worker');
console.log('📦 React-PDF version:', pdfjs.version);
console.log('📦 Using pdfjs-dist version:', ACTUAL_PDFJS_VERSION);

// Configure worker with the correct version
const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${ACTUAL_PDFJS_VERSION}/legacy/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

console.log('✅ PDF.js worker configured with:', workerUrl);

createRoot(document.getElementById("root")!).render(
  <App />
);


import { createRoot } from 'react-dom/client'
import { pdfjs } from 'react-pdf';
import App from './App.tsx'
import './index.css'

// Configure PDF.js worker with fallback options
const configureWorker = () => {
  try {
    // Try to use local worker first (production build)
    if (import.meta.env.PROD) {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.js',
        import.meta.url
      ).toString();
    } else {
      // Development: use CDN with specific version
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
    }
    
    console.log('✅ PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);
    console.log('📖 PDF.js version:', pdfjs.version);
  } catch (error) {
    console.error('❌ Failed to configure PDF.js worker:', error);
    // Fallback to CDN with hardcoded version
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`;
    console.log('🔄 Using fallback worker configuration');
  }
};

configureWorker();

createRoot(document.getElementById("root")!).render(
  <App />
);

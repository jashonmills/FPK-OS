
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { pdfjs } from 'react-pdf'

console.log('🚀 Application starting...');

// Configure PDF.js worker to use local file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

console.log('✅ PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);

// Add global error handler for better error tracking
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Track PDF-related errors separately
  if (event.error?.message?.includes('pdf') || event.error?.message?.includes('worker')) {
    console.warn('📄 PDF-related error detected:', event.error.message);
    
    // Don't let PDF errors crash the entire app
    event.preventDefault();
  }
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Handle PDF-related promise rejections gracefully
  if (event.reason?.message?.includes('pdf') || event.reason?.message?.includes('worker')) {
    console.warn('📄 PDF-related promise rejection handled:', event.reason.message);
    event.preventDefault();
  }
});

// Performance monitoring for PDF loading
if ('performance' in window && 'observe' in window.PerformanceObserver.prototype) {
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('pdf') || entry.name.includes('worker')) {
        console.log('📊 PDF Performance:', {
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime
        });
      }
    }
  });
  
  try {
    perfObserver.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
  } catch (e) {
    console.log('Performance observer not fully supported');
  }
}

createRoot(document.getElementById("root")!).render(
  <App />
);

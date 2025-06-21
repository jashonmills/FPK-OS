
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeReliablePDF, getPDFWorkerStatus } from './utils/reliablePdfConfig'

console.log('🚀 Application starting...');

// Initialize reliable PDF.js configuration
const pdfWorkerReady = initializeReliablePDF();
console.log('📄 PDF Worker Status:', getPDFWorkerStatus());

if (!pdfWorkerReady) {
  console.warn('⚠️ PDF worker initialization failed - PDF viewing may be impacted');
}

// Enhanced error handler for PDF-related issues
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Track PDF-related errors separately with better handling
  if (event.error?.message?.includes('pdf') || 
      event.error?.message?.includes('worker') ||
      event.error?.message?.includes('PDF')) {
    console.warn('📄 PDF-related error detected:', {
      message: event.error.message,
      filename: event.filename,
      lineno: event.lineno,
      stack: event.error.stack?.substring(0, 200)
    });
    
    // Don't let PDF errors crash the entire app
    event.preventDefault();
    
    // Attempt to reinitialize PDF worker if needed
    if (event.error.message?.includes('worker')) {
      console.log('🔄 Attempting PDF worker reinitialization...');
      setTimeout(() => {
        initializeReliablePDF();
      }, 1000);
    }
  }
});

// Enhanced promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Handle PDF-related promise rejections gracefully
  if (event.reason?.message?.includes('pdf') || 
      event.reason?.message?.includes('worker') ||
      event.reason?.message?.includes('PDF')) {
    console.warn('📄 PDF-related promise rejection handled:', {
      reason: event.reason.message,
      stack: event.reason.stack?.substring(0, 200)
    });
    event.preventDefault();
  }
});

// Performance monitoring for PDF operations
if ('performance' in window && 'observe' in window.PerformanceObserver.prototype) {
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries())   {
      if (entry.name.includes('pdf') || 
          entry.name.includes('worker') || 
          entry.name.includes('PDF')) {
        console.log('📊 PDF Performance:', {
          name: entry.name,
          duration: `${entry.duration.toFixed(2)}ms`,
          startTime: entry.startTime,
          type: entry.entryType
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

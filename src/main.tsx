
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializePDFWorker } from './utils/pdfWorkerConfig'

console.log('🚀 Application starting...');

// Initialize PDF worker early but don't block app startup
initializePDFWorker().then(success => {
  if (success) {
    console.log('✅ PDF functionality ready');
  } else {
    console.warn('⚠️ PDF functionality may be limited');
  }
}).catch(error => {
  console.warn('⚠️ PDF worker initialization failed:', error);
});

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Don't let PDF errors crash the entire app
  if (event.error?.message?.includes('pdf') || event.error?.message?.includes('worker')) {
    event.preventDefault();
    console.warn('PDF-related error caught and handled');
  }
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Don't let PDF promise rejections crash the app
  if (event.reason?.message?.includes('pdf') || event.reason?.message?.includes('worker')) {
    event.preventDefault();
    console.warn('PDF-related promise rejection caught and handled');
  }
});

createRoot(document.getElementById("root")!).render(
  <App />
);

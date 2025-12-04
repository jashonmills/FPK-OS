
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const workerSrc = path.resolve('node_modules/pdfjs-dist/build/pdf.worker.min.js');
const workerDest = path.resolve('public/pdfjs/pdf.worker.min.js');
const destDir = path.dirname(workerDest);

// Create directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('📁 Created pdfjs directory in public/');
}

// Copy worker file
if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, workerDest);
  console.log('✅ PDF.js worker copied to public/pdfjs/pdf.worker.min.js');
} else {
  console.error('❌ PDF.js worker not found at:', workerSrc);
  process.exit(1);
}

// Also copy the main PDF.js file for completeness
const pdfSrc = path.resolve('node_modules/pdfjs-dist/build/pdf.min.js');
const pdfDest = path.resolve('public/pdfjs/pdf.min.js');

if (fs.existsSync(pdfSrc)) {
  fs.copyFileSync(pdfSrc, pdfDest);
  console.log('✅ PDF.js library copied to public/pdfjs/pdf.min.js');
}

console.log('🎉 PDF.js assets setup complete!');

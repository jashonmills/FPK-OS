
const CACHE_NAME = 'neurodiversity-reader-v1';
const STATIC_CACHE = 'static-v1';
const DOCUMENTS_CACHE = 'documents-v1';
const PDFJS_CACHE = 'pdfjs-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pdfjs/pdf.worker.min.js',
  '/pdfjs/pdf.min.js'
];

// PDF.js specific assets
const PDFJS_ASSETS = [
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/cmaps/',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/standard_fonts/'
];

self.addEventListener('install', (event) => {
  console.log('📦 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(PDFJS_CACHE).then(cache => {
        // Pre-cache PDF.js worker
        return cache.addAll(['/pdfjs/pdf.worker.min.js']);
      })
    ])
  );
  
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith('neurodiversity-reader-') && cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle PDF.js worker requests
  if (url.pathname.includes('pdf.worker') || url.pathname.includes('pdfjs')) {
    event.respondWith(handlePDFJSRequest(request));
    return;
  }
  
  // Handle document requests (PDFs, EPUBs)
  if (isDocumentRequest(request)) {
    event.respondWith(handleDocumentRequest(request));
    return;
  }
  
  // Handle static assets
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

async function handlePDFJSRequest(request) {
  try {
    const cache = await caches.open(PDFJS_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('📄 Serving PDF.js asset from cache:', request.url);
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('❌ PDF.js asset request failed:', error);
    throw error;
  }
}

async function handleDocumentRequest(request) {
  try {
    const cache = await caches.open(DOCUMENTS_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('📚 Serving document from cache:', request.url);
      return cached;
    }
    
    // Only cache documents if explicitly requested via cache header
    const response = await fetch(request);
    
    if (response.ok && request.headers.get('x-cache-document') === 'true') {
      // Check cache size limits
      const cacheSize = await getCacheSize(DOCUMENTS_CACHE);
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      if (cacheSize < maxSize) {
        cache.put(request, response.clone());
        console.log('💾 Cached document:', request.url);
      }
    }
    
    return response;
  } catch (error) {
    console.error('❌ Document request failed:', error);
    
    // Try to serve from cache if network fails
    const cache = await caches.open(DOCUMENTS_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('📚 Serving stale document from cache:', request.url);
      return cached;
    }
    
    throw error;
  }
}

async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback to cache for offline access
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

function isDocumentRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();
  
  return pathname.endsWith('.pdf') || 
         pathname.endsWith('.epub') || 
         pathname.includes('/epub-proxy') ||
         request.headers.get('accept')?.includes('application/pdf') ||
         request.headers.get('accept')?.includes('application/epub');
}

async function getCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  let totalSize = 0;
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const size = response.headers.get('content-length');
      if (size) {
        totalSize += parseInt(size);
      }
    }
  }
  
  return totalSize;
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_DOCUMENT') {
    const { url, metadata } = event.data;
    cacheDocument(url, metadata);
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearDocumentCache();
  }
});

async function cacheDocument(url, metadata) {
  try {
    const cache = await caches.open(DOCUMENTS_CACHE);
    const request = new Request(url, {
      headers: { 'x-cache-document': 'true' }
    });
    
    await cache.add(request);
    console.log('💾 Document cached via message:', metadata.title);
    
    // Notify main thread
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'DOCUMENT_CACHED',
          url,
          metadata
        });
      });
    });
  } catch (error) {
    console.error('❌ Failed to cache document:', error);
  }
}

async function clearDocumentCache() {
  try {
    await caches.delete(DOCUMENTS_CACHE);
    console.log('🗑️ Document cache cleared');
    
    // Notify main thread
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'CACHE_CLEARED' });
      });
    });
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
  }
}
